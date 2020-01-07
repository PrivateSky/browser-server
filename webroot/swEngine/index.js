const STORAGE_PROVIDER = "EDFSBrickStorage";
const STORAGE_URL = "http://192.168.103.149:9091";
const Middleware = require("./utils/Middleware").Middleware;
const ChannelsManager = require("./utils/ChannelsManager").getChannelsManager();
const UtilFunctions = require("./utils/utilFunctions").UtilFunctions;
//const Filer = require("./utils/filer/Filer").Filer;
//Filer.init(STORAGE_PROVIDER, STORAGE_URL);
const Filer = {
    extractFolder: function () {
        console.log("Not implemented");
    },
    addFolder: function () {
        console.log("Not implemented");
    }


}
const fs = require("fs");

// create a global ref
let server = new Middleware();
//
// server.get("/vmq/:channelId", function (req, res, next) {
//     console.log(req.params);
//     next();
// });
//
// server.get("/vmq/:channelName", function (req, res, next) {
//     console.log(req.params);
//     res.json({params:req.params});
// });

// server.get("/file", function (req, res, next) {
//
//     let timestamp  = Date.now();
//     let folderName = "rafa-"+-timestamp;
//     fs.mkdir(folderName, (err) => {
//         if (err) throw err;
//
//         console.log("FILE request");
//
//         let promise = Promise.resolve();
//
//
//         promise = promise.then(() => {
//             return new Promise((resolve, reject) => {
//                 fs.writeFile(folderName + '/message.txt', "Lorem ipsum", (err) => {
//                     if (err) reject(err);
//                     else {
//                         resolve();
//                     }
//                 });
//             });
//         });
//
//
//         promise = promise.then(() => {
//             return new Promise((resolve, reject) => {
//                 fs.access(folderName + '/message.txt', (err, stats) => {
//                     if (err) reject(err);
//                     else {
//                         console.log(stats);
//                         resolve(stats);
//                     }
//                 });
//             });
//         });
//
//         promise = promise.then(()=>{
//             return new Promise((resolve,reject)=>{
//                 Filer.addFolder(folderName, (err, digest)=>{
//                     if(err){
//                         reject(err);
//                     }
//                     else
//                     {   console.log("Done");
//
//                         resolve(digest);
//                     }
//                 })});
//         });
//
//         promise = promise.then(() => {
//             return new Promise((resolve, reject) => {
//                 Filer.extractFolder(folderName, (err) => {
//                     if (err) {
//                         reject(err);
//                     }
//                     else {
//                         resolve("Finished");
//                     }
//                 });
//             });
//         })
//
//         promise = promise.then((status)=>{
//             console.log(status, folderName);
//         })
//
//
//     });
//
//     //res.attachment("/file/rafa");
// });


// server.post("/vmq/:channelId", function(req, res, next){
//     if(typeof req.body === "object"){
//         res.status(200).send({status:"ok"});
//     }
//     else{
//         res.status(200).send({status:"ok"});
//     }
// });
//
// server.post("/upload", function(req, res, next){
//     if(req.body.attachment instanceof  File){
//         res.status(200).send({status:"File upload completed"});
//     }
//     else{
//         res.status(500).send({status:"File upload failed"});
//     }
// });


/*
* just adding the event listener to catch all the requests
*/

server.put("/create-channel/:channelName", function (req, res) {
    ChannelsManager.createChannel(req.params.channelName, function (err) {
        if (err) {
            res.status(err.code || 500);

        } else {
            res.status(200);
        }
        res.end();
    });
});

server.post("/forward-zeromq/:channelName", function(req, res){
    ChannelsManager.forwardMessage(req.params.channelName,function(err){
        if(err){
            res.status(err.code || 500);
        }
        res.end();
    });
});
server.post("/send-message/:channelName", function (req, res) {

    UtilFunctions.prepareMessage(req, function (err, bodyAsBuffer) {

        if (err) {
            res.status(err.code || 500);
            res.end();
        } else {
            ChannelsManager.sendMessage(req.params.channelName, bodyAsBuffer, function (err) {
                if (err) {
                    res.status(err.code || 500);

                } else {
                    res.status(200);
                }
                res.end();
            });
        }

    })

});

server.get("/receive-message/:channelName", function (req, res) {
    ChannelsManager.receiveMessage(req.params.channelName, function (err, message) {
        if (err) {
            res.status(err.code || 500);
        } else {
            if (Buffer.isBuffer(message)) {
                res.setHeader('content-type', 'application/octet-stream');
            }

            if (typeof message.length !== "undefined") {
                res.setHeader('content-length', message.length);
            }

            res.status(200);
            res.send(message);
        }
        res.end();
    });
});

/*
* if no previous handler response to the event it means that the url doesn't exit
*
**/
server.use(function (req, res, next) {
    res.status(404);
    res.end();
});

server.init(self);

self.addEventListener('activate', function (event) {
    console.log("Activating service worker", event);
    try {
        clients.claim();
    } catch (err) {
        console.log(err);
    }
});


