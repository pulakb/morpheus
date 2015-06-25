'use strict';

var http = require('http'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./lib/model/collectionDriver').CollectionDriver,
    serverConfig = require('./config'),
    provider = require('./lib/module/'),
    webServer;

// IIFE to keep Global space clean & connect to MongoDB server
(function () {
    var mongoClient = new MongoClient(new Server(serverConfig.dbServer.mongoHost, serverConfig.dbServer.mongoPort));

    mongoClient.open(function (err, mongoClient) { //C
        if (!mongoClient) {
            console.error("Error! Exiting... Must start MongoDB first");
            process.exit(1); //D
        }
        var db = mongoClient.db(serverConfig.dbServer.dbName);  //E
        //collectionDriver = new CollectionDriver(db); //F
        //initialize();
        provider.collectionDriver = new CollectionDriver(db);
        provider.initialize();

    });
})();

webServer = http.createServer(function (req, res) {});
webServer.listen(serverConfig.webServer['port']);
console.log('Server is listening');