#!/usr/bin/env node
'use strict';
const range = require('node-range');
const async = require('async');
const request = require('request');

const helpers = require('./helpers');
const display = require('./display');

const config = require('./config');

const requestOptions = {
    url: config.url,
    method: config.method,
    timeout: config.timeout
};

const amount = config.count;
const concurrent = config.concurrent;

const _requestHistory = [[]];

const rpsInterval = setInterval(() => {
    console.log(`${_requestHistory[_requestHistory.length - 1].length} rps`);
    _requestHistory.push([]);
}, 1000);

async.parallelLimit(
    range(0, amount)
        .map((i) => (cb) => {
            if (i % 1000 === 0) {
                console.log('requested', i);
            }

            const start = Date.now();

            const obj = {
                start
            };
            _requestHistory[_requestHistory.length - 1].push(obj);

            request(requestOptions, (err, http, data) => {
                obj.time = Date.now() - start;
                obj.to = !!(err && err.code === 'ETIMEDOUT');
                obj.err = err && err.code !== 'ETIMEDOUT' && err;
                obj.code = http && http.statusCode;
                obj.data = !!data;

                if (obj.err) {
                    console.error(err);
                }
                return cb();
            });
        })
    ,
    concurrent,
    () => {
        'use strict';
        console.log('done');


        let resp = {
            _1xx: 0,
            _2xx: 0,
            _3xx: 0,
            _4xx: 0,
            _5xx: 0,
            _to: 0,
            _err: 0
        };

        for (let i = _requestHistory.length - 1; i >= 0; i--) {
            if (!_requestHistory[i].length) {
                _requestHistory.splice(i, 1);
            }
        }

        _requestHistory.forEach(second => {
            second.forEach(d => {
                if (d.to) {
                    return resp._to++;
                }
                if (d.err) {
                    return resp._err++;
                }

                resp[`_${d.code.toString()[0]}xx`]++;
            });
        });

        const flatHistory = _requestHistory.reduce((arr, cur) => arr.concat(cur), []);

        console.log('\nCodes:');
        console.log('1xx', resp._1xx);
        console.log('2xx', resp._2xx);
        console.log('3xx', resp._3xx);
        console.log('4xx', resp._4xx);
        console.log('5xx', resp._5xx);
        console.log('err', resp._err);
        console.log('t/o', resp._to);

        console.log('\nTimes:');
        console.log('avg time', helpers.avg(flatHistory.map(x => x.time)));
        console.log('avg rps', helpers.avg(_requestHistory.map(x => x.length)));

        const times = flatHistory.filter(x => !x.to).map(x => x.time);

        console.log('\nStats:');
        const output = [];
        output.push(helpers.outputTime(times, .10));
        output.push(helpers.outputTime(times, .35));
        output.push(helpers.outputTime(times, .50));
        output.push(helpers.outputTime(times, .75));
        output.push(helpers.outputTime(times, .95));
        output.push(helpers.outputTime(times, 1.0));

        if (config.html) {
            display(config.html, _requestHistory, output, Object.assign({}, resp, {
                rps: helpers.avg(_requestHistory.map(x => x.length)),
                time: helpers.avg(flatHistory.map(x => x.time)),
                url: `${requestOptions.method.toUpperCase()}: ${requestOptions.url}`
            }));
        }

        clearInterval(rpsInterval);

    }
);

