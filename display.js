'use strict';
const fs = require('fs');
const path = require('path');
const display = (filePath, data, output, seconds,  url) => {
    let file = fs.readFileSync(path.join(__dirname, 'template.html')).toString();

    file = file.replace('\'%%DATA%%\'', JSON.stringify(data));

    file = file.replace('\'%%SECONDS%%\'', JSON.stringify(seconds));
    file = file.replace('%%OUTPUT%%', output.split('\n').map(str => `<h3>${str}</h3>`).join('\n'));

    file = file.replace('%%URL%%', url);

    fs.writeFileSync(filePath, file);

    console.log('report file available at:', `file://${path.resolve(filePath)}`);
};

module.exports = display;
