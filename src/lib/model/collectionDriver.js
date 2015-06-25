var ObjectID = require('mongodb').ObjectID;
var path = require("path");
var url = require("url");
var channelImage = [];
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

// Rovi

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

//rovi

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


//rovi
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
                    var path = "/assets/channels_logo/"
                    var myUrl = obj[i].ChannelImages[0].ImageUrl;
                    var pathname = url.parse(myUrl).pathname;
                    var last = pathname.substring(pathname.lastIndexOf("/") + 1);
                    channelImage = path + last;

                }
                updateChannels(SourceId, Programs, channelImage);

            }

            callback();
            function updateChannels(SourceId, Programs, channelImage) {

                the_collection.update({"SourceId":SourceId, "channelImage": channelImage},{$pushAll:{ "Programs": Programs}},{upsert: true}, function() {
                });
            }
        }
    });
};


//rovi
//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    //var collName = "cloudDB1";
    this.getCollection(collectionName, function(error, the_collection) { //A
        if( error ) callback(error)
        else {
            //obj.created_at = new Date(); //B
            //console.log(obj);
            the_collection.insert({"name":"channelArray", "channels": obj, "created_at":new Date()}, function() { //C
                console.log("Insertedd...");
//the_collection.insert({"name":"page1"}, function(error) {
                //if (error) {callback(error);}
//});
                callback(null, obj);
            });

        }
    });
};

//rovi
//delete a specific object
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

//rovi
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
            console.log("all is well so far");

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
