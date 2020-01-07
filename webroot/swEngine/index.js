const Middleware = require("./utils/Middleware").Middleware;
const ChannelsManager = require("./utils/ChannelsManager").getChannelsManager();
const UtilFunctions = require("./utils/utilFunctions").UtilFunctions;

// create a global ref
let server = new Middleware();

function createChannelHandler (req, res) {
    ChannelsManager.createChannel(req.params.channelName, function (err) {
        if (err) {
            res.status(err.code || 500);

        } else {
            res.status(200);
        }
        res.end();
    });
}

function forwardMessageHandler(req, res){
    ChannelsManager.forwardMessage(req.params.channelName,function(err){
        if(err){
            res.status(err.code || 500);
        }
        res.end();
    });
}

function sendMessageHandler (req, res) {

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
}

function receiveMessageHandler (req, res) {
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
}

/*
* just adding the event listener to catch all the requests
*/

server.put("/create-channel/:channelName", createChannelHandler);
server.post("/forward-zeromq/:channelName", forwardMessageHandler);
server.post("/send-message/:channelName", sendMessageHandler);
server.get("/receive-message/:channelName", receiveMessageHandler);

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


