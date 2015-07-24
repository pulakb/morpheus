'use strict'

/*
* Database & Web Server configurations are maintained here.
* */

var serverConfig = {
    webServer: {
        port: 3000
    },
    dbServer: {
        mongoHost: 'localhost',
        mongoPort: 27017,
        collectionName: 'rovi',
        dbName: 'Test-node-rovi'
    },
    roviApi: "http://api.rovicorp.com/TVlistings/v9/listings/gridschedule/20394/info?locale=en-US&duration=30&includechannelimages=false&format=json&apikey=2pf79jxpfqsqjd2jcrcw65as",
    gridSchedule: "http://api.rovicorp.com/TVlistings/v9/listings/gridschedule/20394/info?apikey=s8brrx2spxjb82wy7w42s583&sig=sig&includechannelimages=true&locale=en-US&startdate="
};

module.exports = serverConfig;