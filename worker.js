'use strict';
const cluster = require('cluster');
const request = require('request');

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

process.on('message', (msg) => {
    if (!(msg && msg.type)) {
        console.error('invalid message');
        console.error(msg);
        return;
    }

    switch (msg.type) {
        case 'setup' :
            SETUP(msg.data);
            break;
        case 'req':
            DO_REQUESTS_FOR_SECOND(msg.data);
            break;
        case 'stats':
            STATS();
            break;
        case 'raw':
            RAW();
            break;
        default:
            throw 'unknown message';
    }
});

let concurrent = null;
let requestOptions = null;
let config = null;

const SETUP = (data) => {
    config = data;
    requestOptions = {
        url: config.url,
        method: config.method,
        timeout: config.timeout
    }
    concurrent = data.concurrentPerCPU;

    if (config.method === "POST") {
        let body = config.body;

        if (!requestOptions.headers) requestOptions.headers = {};
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.headers['Content-Length'] = body.length;
        
        requestOptions.body = body;
    }
};

const STATS = () => {
    process.send({ type: 'stats', data: _statsForSecond, req: _requestCount });
    resetStats();
};

const RAW = () => {
    process.send({ type: 'raw', data: _requests });
};

const DO_REQUESTS_FOR_SECOND = (second) => {
    for (let i = 0; i < concurrent; i++) {
        _requests.push({
            code: 0,
            time: 0,
            start: 0,
            sec: second,
            err: 0,
            to: 0,
            body: 0
        });
        setTimeout(_doSingleRequest.bind(null, i + second * concurrent), i / concurrent * 1000);
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

