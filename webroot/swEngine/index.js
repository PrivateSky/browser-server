console.log(loadScript("swEngine/utils/Middleware.js"));
loadScript("swEngine/utils/Middleware.js").then(()=>{console.log(Middleware)});
// create a global ref
console.log("Ceva log");
let server = new Middleware();

/*
*just a simple logger can be removed later
*
**/
server.use(function (event, next) {
    console.log(event);
    next();
});

server.get("/vmq/:channelId", function(event, next){

});

server.post("/vmq/:channelId", function(event, next){

});

/*
* if no previous handler response to the event it means that the url doesn't exit
*
**/
server.use(function (event, next) {
    event.sendResponse(undefined, {"status": 404, "statusText": "Not Found"});
});

/*
* just adding the event listener to catch all the requests
*
**/
self.addEventListener('fetch', (event)=>{
    let {req, res} = makeShims(event);
    server.executeRequest(req, res);
});

/*
* sendResponse instance method used to send reponse on event
*
**/
FetchEvent.prototype.sendResponse = function(response, status){
    let eventStatus = status || {"status": 200, "statusText": "ok"};
    let eventResponse = response || "";

    this.respondWith(new Promise((resolve) => {
        let response = new Response(eventReponse, eventStatus);
        resolve(response);
    }));
}

console.log("Extra logic was added");
