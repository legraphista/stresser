'use strict';
const cluster = require('cluster');

if (cluster.isMaster) {
    const config = require('./config');

    console.error('Booting up', config.CPUs, 'workers');
    let online = 0;
    for (let i = 0; i < config.CPUs; i++) {
        const worker = cluster.fork();
        worker.on('online', () => {
            online++;

            setTimeout(() => {
                worker.send({ type: 'setup', data: config });

                if (online === config.CPUs) {
                    return setTimeout(() => require('./master'), 100);
                }
            }, 100);
        });
    }

    return;
}

return require('./worker');