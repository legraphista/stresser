'use strict';
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const url = argv._[0];

if (argv.h || argv.help || !url) {
    console.log(
        `
    Usage: stresser <URL> [options]

    Options:
        -h | --help
            Outputs this helpful information

        -t | --timeout= <milliseconds> [10000]
            Sets the time a request waits for response

        -n | --count= <number> [10]
            Sets the number of seconds

        -c | --concurrent= <number> [100]
            Sets the number of concurrent requests

        -m | --method <GET|HEAD|POST|PUT|DELETE|*> [GET]
            Sets the request method

        -f | --force
            Forces the stress test to stop at the requested time even if requests have not finished

        -v | --verbose <e|b|c>
            Sets verbosity
                - e: Errors
                - c: HTTP Status Codes
                - b: HTTP body

        --html=<path/to/report/file.html> [${path.join(__dirname, 'report', `report-${Date.now()}.html`)}]
            Outputs an HTML report file to location
            Set --html=false if you want to disable it

        --threads=<number> [#cpus]
            The number of cpus that will be used to stress test


    Example: stresser http://example.com/page.html -c 10000 -n 10 -t 20000 --html=/home/reports/report-$(date +%s).html --threads=16 --force
`
    );

    process.exit(1);
}

const html = argv.html === false || argv.html === 'false' ? null : argv.html || path.join(path.dirname(process.argv[1]), 'report', `report-${Date.now()}.html`);
const timeout = argv.t || argv.timeout || 10000;
const count = argv.n || argv.count || 10;
const concurrent = argv.c || argv.concurrent || 100;
const method = argv.m || argv.method || 'get';

const _v = argv.v || argv.verbose || '';
const verbose = {
    e: ~_v.indexOf('e'),
    c: ~_v.indexOf('c'),
    b: ~_v.indexOf('b')
};

const CPUs = argv.threads || require('os').cpus().length;
const concurrentPerCPU = Math.max(Math.floor(concurrent / CPUs), 1);
const force = argv.f || argv.force;

module.exports = {
    url,
    method,
    count,
    concurrent,
    timeout,
    html,
    verbose,
    concurrentPerCPU,
    CPUs,
    force
};

html && console.error('Will output report file to', html);