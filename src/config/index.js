'use strict'

var serverConfig = {
    webServer: {
        port: 3000
    },
    dbServer: {
        mongoHost: 'localhost',
        mongoPort: 27017,
        collectionName: 'rovi',
        dbName: 'Test-node-rovi'
    }
};

module.exports = serverConfig;