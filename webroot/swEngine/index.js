const Middleware  = require("./utils/Middleware").Middleware;
// create a global ref
let server = new Middleware();
/*
*just a simple logger can be removed later
*/
server.use(function (req, res, next) {
    console.log(req.body);
    console.log("first step");
    console.log(req.get("content-type"));
    next();
});

server.get("/vmq/:channelId", function (req, res, next) {
    console.log(req.params);
    next();
});

server.get("/vmq/:channelName", function (req, res, next) {
    console.log(req.params);
    res.json({params:req.params});
});

server.get("/file", function (req, res, next) {
    res.attachment("/file/rafa");
});


server.post("/vmq/:channelId", function(req, res, next){
    if(typeof req.body === "object"){
        res.status(200).send({status:"ok"});
    }
    else{
        res.status(200).send({status:"ok"});
    }
});

server.post("/upload", function(req, res, next){
    if(req.body.attachment instanceof  File){
        res.status(200).send({status:"File upload completed"});
    }
    else{
        res.status(500).send({status:"File upload failed"});
    }
});

/*
* if no previous handler response to the event it means that the url doesn't exit
*
**/
server.use(function (req, resp, next) {
    resp.send(undefined, {"status": 404, "statusText": "Not Found"});
});

/*
* just adding the event listener to catch all the requests
*/
server.init(self);


self.addEventListener('activate', function (event) {
    console.log("Activating service worker", event);
    try{
        clients.claim();
    } catch(err){
        console.log(err);
    }

});

