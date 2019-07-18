const Middleware  = require("./utils/Middleware").Middleware;
// create a global ref
let server = new Middleware();
/*
*just a simple logger can be removed later
*/
server.use(function (req, resp, next) {
    console.log("first step");
    next();
});

server.get("/vmq/:channelId", function (req, res, next) {
    console.log(req.params);
    next();
    //res.send("Hello from the " + req.params.channelId);
});

server.get("/vmq/:channelName", function (req, res, next) {
    console.log(req.params);
    res.send("Hello from the " + req.params.channelName);
});


server.post("/vmq/:channelId", function(req, res, next){

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

