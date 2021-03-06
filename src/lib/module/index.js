/*'use strict';*/
/*
* Provider helps connect 'collectionDriver' model to insert dara
* in database
* */

var serverConfig = require('../../config'),
    roviReq = require('request');

// Define a constructor function and declare class members
function Provider() {
   this.collectionDriver = null;
   this.collectionName = serverConfig.dbServer.collectionName;
   this.channelList = [];
}

// Define prototype members
Provider.prototype.initialize = function () {
    var _self = this;

    this.collectionDriver.find(this.collectionName, function(err, obj) {
        var dt = new Date(obj).getUTCDate();
        var da = new Date().getUTCDate();
        if ((obj !== undefined) || (da !== dt)) {
            _self.collectionDriver.delete(this.collectionName,function() {
                _self.epgChannelList(function(channelList) {
                    _self.epgProgramList();
                });

            });
        }
    });
};

Provider.prototype.epgChannelList = function (callback) {
    var obj;
    var collection = this.collectionName;
    var _self = this;

    // Set the Rovi API from Config
    var url = serverConfig.roviApi;

    _self.rovicall(url, function(body){
        var sourceId = "";
        if (body){ data = JSON.parse(body);}
        obj = data.GridScheduleResult.GridChannels;

        var count = 0;
        for (var i = 0; i < obj.length; i++) {
            _self.channelList.push(obj[i].SourceId);
            if (i == (obj.length -1)) {
                callback(_self.channelList);
            }
        }
    });
};

Provider.prototype.epgProgramList = function () {
    var dt;
    var _self = this;

    for (var j = 0; j < 7; j++) {
        if (j === 0) {
            dt = new Date();
        }

        var utcTime = dt.toISOString();
        dt.setUTCMinutes('00');
        dt.setUTCSeconds('00');
        dt.setUTCHours('00');
        dt.setUTCMilliseconds('00');
        var urlList = [];

        for (var i = 0; i < 6; i++) {
            var url = serverConfig.gridSchedule + dt.toISOString() + "&duration=30";
            this.programListArray(url, 0, function (err1, obj1) {
                if (err1) {
                    console.log(err1);
                }
                else {
                    _self.collectionDriver.removeDuplicate(_self.collectionName, _self.channelList, function (err, obj) {
                        if (!err) {
                            console.log(obj);
                        }
                    });
                }
            });
            dt.setUTCHours(dt.getUTCHours() + 4);
        }
    }
};

Provider.prototype.programListArray = function (url,i, callback) {
    var _self = this;

    this.rovicall(url, function(body){
        var data = JSON.parse(body);
        var collection = _self.collectionName;
        var obj = data.GridScheduleResult.GridChannels;

        _self.collectionDriver.savePrograms(collection,obj, function(error, objs) {
            if (error) { console.log(error); }
            else {
                if (i == 5){ console.log("noww");
                    callback();}
            }
        });
    });
};

Provider.prototype.rovicall = function (url, callback) {
    roviReq(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }
    })
};

module.exports = new Provider();