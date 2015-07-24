var ObjectID = require('mongodb').ObjectID;

var path = require("path");
var url = require("url");

var channelImage = [];

/*
* Define 'CollectionDriver' constructor function and methods to its
* prototypes.
* */
var CollectionDriver = function(db) {
    this.db = db;
};
// Rovi

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
    this.db.collection(collectionName, function(error, the_collection) {
        if( error ) callback(error);
        else callback(null, the_collection);
    });
};

/*
* db.collection.find(query, projection) - Selects documents in a collection and returns a cursor to the selected documents.
* The toArray() method returns an array that contains all the documents from a cursor. The method iterates completely
* the cursor, loading all the documents into RAM and exhausting the cursor.
* */

CollectionDriver.prototype.find = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if( error ) callback(error)
        else {
            the_collection.find().toArray(function(error, result) {
                if( error ) callback("err::"+error)
                else { console.log(result.length);
                    var res;
                    if (result && result.length) {
                        res =result[0].created_at;
                    }
                    callback(null, res);
                }

            });
        }

    });

};

//find all objects for a collection
CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if( error ) callback(error)
        else {
            the_collection.find({},{"channelsArray.channelId":1,"channelsArray.channelName":1,"channelsArray.channelNumber":1,"channelsArray.isFavourite":1,"channelsArray.imageReference":1,"channelsArray.created_at":1, "_id":0}).toArray(function(error, results) { //B
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

CollectionDriver.prototype.removeDuplicate = function(collectionName,channelList, callback) {
    var channelImage;
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback("error::::"+error)
        else { var SourceId;

            function herew(SourceId) {
                the_collection.distinct("Programs", {"SourceId": SourceId},function(err, res) {
                    if(!err) {
                        var aa = res.sort(function(obj1, obj2) {
                            return new Date(obj1.AiringTime) - new Date(obj2.AiringTime);

                        });
                        the_collection.find({"SourceId":SourceId}, {"channelImage":1,"_id":0}).toArray( function(err, result) {
                            if (!err) {channelImage = result[0].channelImage;

                                the_collection.remove({"SourceId":SourceId}, function(err, result) {
                                    if (!err) {
                                        console.log("result:::");
                                        the_collection.update({"SourceId":SourceId, "channelImage": channelImage},{$pushAll:{ "Programs": aa}},{upsert: true}, function() {
                                        });
                                    }

                                });
                            }
                        });
                    }
                });
            }
            for (var i =0; i < channelList.length; i++) {
                SourceId = channelList[i];
                herew(SourceId);
            }

        }
    });
};

CollectionDriver.prototype.savePrograms = function(collectionName, obj, callback) {
    var SourceId;
    var Programs;
    this.getCollection(collectionName, function(error, the_collection) { //A
        if( error ) callback(error)
        else {

            for(var i = 0; i< obj.length; i++ ) {
                SourceId = obj[i].SourceId;
                Programs = obj[i].Airings;
                if (obj[i] !== undefined && obj[i].ChannelImages.length == 1) {
                    //console.log("yes........savePrograms."+obj.length);
                    var path = "/assets/channels_logo/";
                    var myUrl = obj[i].ChannelImages[0].ImageUrl;
                    var pathname = url.parse(myUrl).pathname;
                    var last = pathname.substring(pathname.lastIndexOf("/") + 1);
                    channelImage = path + last;

                }
                updateChannels(SourceId, Programs, channelImage);

            }

            callback();

            /*
            * db.collection.update(query, update, options) - Modifies an existing document or documents in a collection.
            * The method can modify specific fields of an existing document or documents or replace an existing
            * document entirely, depending on the update parameter.
            * By default, the update() method updates a single document.
            * */

            function updateChannels(SourceId, Programs, channelImage) {
                the_collection.update({"SourceId":SourceId, "channelImage": channelImage},{$pushAll:{ "Programs": Programs}},{upsert: true}, function() {
                });
            }
        }
    });
};

/*
* db.collection.insert() - Inserts a document or documents into a collection.
* */
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if( error ) callback(error)
        else {
            the_collection.insert({"name":"channelArray", "channels": obj, "created_at":new Date()}, function() { //C
                console.log("Insertedd...");
                callback(null, obj);
            });

        }
    });
};

/*
* db.collection.remove() - Removes documents from a collection.
* */
CollectionDriver.prototype.delete = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error)
        else {
            the_collection.remove(function(error,doc) { //B
                if (error) callback(error)
                else callback();
            });
        }
    });
}

//Perform a collection query
CollectionDriver.prototype.query = function(collectionName, query, callback) { //1
    console.log("calling the query function with query and collection " + JSON.stringify(query)  +":" + collectionName);
    this.getCollection(collectionName, function(error, the_collection) { //2
        if( error )
        {
            console.log(error);
            callback(error);
        }
        else {
            the_collection.find(query).toArray(function(error, results)

            { //3
                if( error )
                {
                    console.log("error in querry "+ error);
                    callback(error);
                }
                else
                {
                    console.log("all in well in query as well" + JSON.stringify(results));
                    callback(null, results);
                }
            });
        }
    });
};

exports.CollectionDriver = CollectionDriver;
