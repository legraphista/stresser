#!/usr/bin/env node
'use strict';
const range = require('node-range');
const async = require('async');
const request = require('request');
const pad = require('pad');

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

let _statsForSecond = null;
const resetStats = () => {
    _statsForSecond = {
        code: {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0
        },
        err: 0,
        to: 0,
        body: 0,

        cnt: 0,
        time: 0,
        min: Infinity,
        max: 0
    }
};
resetStats();

const _requests = [];
let _requestCount = 0;
let _second = 0;
const _secondHistory = [];

const _doRequestsForSecond = () => {
    for (let i = 0; i < concurrent; i++) {
        _requests.push({
            code: 0,
            time: 0,
            start: 0,
            sec: _second,
            err: 0,
            to: 0,
            body: 0
        });
        setTimeout(_doSingleRequest.bind(null, i + _second * concurrent), i / concurrent * 1000);
    }
};

const _doSingleRequest = (idx) => {
    _requestCount++;

    const req = _requests[idx];
    req.start = Date.now();

    request(requestOptions, (err, http, data) => {
        _requestCount--;

        const req = _requests[idx];
        req.time = Date.now() - req.start;
        if (!err) {
            _statsForSecond.time += req.time;
            _statsForSecond.cnt++;

            if (req.time < _statsForSecond.min) {
                _statsForSecond.min = req.time;
            }
            if (req.time > _statsForSecond.max) {
                _statsForSecond.max = req.time;
            }
        }

        if (err && err.code === 'ETIMEDOUT') {
            _statsForSecond.to++;
            return req.to = 1;
        }

        if (err) {
            config.verbose.e && console.error(err);
            _statsForSecond.err++;
            return req.err = 1;
        }

        req.code = http.statusCode;

        _statsForSecond.code[req.code.toString()[0]]++;
        config.verbose.c && console.log('HTTP:', req.code);

        config.verbose.b && console.log('BODY:', data);

        req.body = data.toString().trim().length ? 1 : 0;
        _statsForSecond.body += req.body;
    });
};

const printStats = (stats) => {
    const str = (
        `  S=${pad(6, _second)} |   T=${pad(6, _requests.length)} | A=${pad(6, _requestCount)}
  E=${pad(6, stats.err)} | T/O=${pad(6, stats.to)} | \
W/B=${pad(6, stats.body)} | AVG=${pad(6, (stats.time / stats.cnt) | 0)} | MI=${pad(6, stats.min)} | MX=${pad(6, stats.max)}
${range(1, 6).map(code => `${code}xx=${pad(6, stats.code[code.toString()])}`).join(' | ')}
`);

    console.log(str);
    return str;
};

const _finish = () => {
    const stats = {
        code: {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0
        },
        err: 0,
        to: 0,
        body: 0,

        cnt: 0,
        time: 0,
        min: Infinity,
        max: 0
    };
    _requests.forEach(req => {
        stats.to += req.to;
        stats.err += req.err;
        stats.body += req.body;

        stats.code[req.code.toString()[0]]++;

        if (stats.code) {
            stats.time += req.time;
            stats.cnt++;

            if (req.time < stats.min) {
                stats.min = req.time;
            }
            if (req.time > stats.max) {
                stats.max = req.time;
            }
        }
    });

    console.log('~~~ Aggregated Stats: ~~~');

    const statsStr = printStats(stats);

    if (config.html) {
        display(config.html, _requests, statsStr, _secondHistory, config.url);
    }
};

const rpsInterval = setInterval(() => {
    const shouldRequest = (_second < amount);
    if (shouldRequest) {
        _doRequestsForSecond();
    }

    printStats(_statsForSecond);
    _secondHistory.push(Object.assign({}, _statsForSecond, { active: _requestCount }));
    resetStats();

    _second++;
    if (_requestCount === 0 && !shouldRequest) {
        clearInterval(rpsInterval);
        _finish();
    }
}, 1000);
