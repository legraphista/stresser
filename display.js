'use strict';
const fs = require('fs');
const path = require('path');
const display = (filePath, data, output, stats) => {
    let file = fs.readFileSync(path.join(__dirname, 'template.html')).toString();

    file = file.replace('\'%%DATA%%\'', JSON.stringify(data));
    file = file.replace('%%OUTPUT%%', output.map(str => `<h3>${str}</h3>`).join('\n'));

    file = file.replace('%%1XX%%', stats._1xx | 0);
    file = file.replace('%%2XX%%', stats._2xx | 0);
    file = file.replace('%%3XX%%', stats._3xx | 0);
    file = file.replace('%%4XX%%', stats._4xx | 0);
    file = file.replace('%%5XX%%', stats._5xx | 0);

    file = file.replace('%%T/O%%', stats._to | 0);
    file = file.replace('%%ERR%%', stats._err | 0);

    file = file.replace('%%RPS%%', stats.rps | 0);
    file = file.replace('%%TIME%%', stats.time | 0);

    file = file.replace('%%URL%%', stats.url);

    fs.writeFileSync(filePath, file);

    console.log('report file available at:', `file://${path.resolve(filePath)}`);
};

module.exports = display;
