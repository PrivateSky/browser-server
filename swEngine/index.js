let Middleware = require("./utils/Middleware").Middleware;
// create a global ref
let server = new Middleware();


server.use("/csb", "GET", function (event, next) {
    //function called for each event before matching url in case of pre-processing if need it.
});

server.use("/csb", "POST", function (event, next) {
    console.log("POST")
    //function called for each event before matching url in case of pre-processing if need it.
});

server.use("/pin", "PUT", function (event, next) {
    //function called for each event before matching url in case of pre-processing if need it.
});

server.use(function (event, next) {
});
server.use("/csb", function (event, next) {
});
server.get("/rafa", function (event, next) {
});

server.post("/api/rafa/ale", function (event, next) {
    console.log("static path1");
    next();
});

server.post("/api/radfa/ale", function (event, next) {
    console.log("static path2");
    next();
});


server.post("/api/:apiName/:apiPath", function (event, next) {
    console.log("dynamic path");
});




/*self.addEventListener('fetch', function (event) {
     server.handleEvent(event);
});*/

//console.log(server.listAllHandlers());

server.fakeRequest("/api/rasfa/ale", "POST");



