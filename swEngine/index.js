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
    console.log("first use ")
    next();
});
server.use("/csb", function (event, next) {
});
server.get("/rafa", function (event, next) {
});


server.use("/api/*", function (event, next) {
   console.log("Check authentication");
    next();
});



server.post("/api/rafa/ale", function (event, next) {
    console.log("static path1");
    next();
});

server.post("/api/rafa/*", function (event, next) {
    console.log("static path2");
    next();
});

server.post("/api/*/ale", function (event, next) {
    console.log("static path3");
    next();
});


server.use(function (event, next) {
   console.log("bay");
   next();
});

server.post("/api/:apiName/:apiPath", function (event, next) {
    console.log("dynamic path");
    next();
});




/*self.addEventListener('fetch', function (event) {
     server.handleEvent(event);
});*/

//console.log(server.listAllHandlers());

server.executeRequest({
    request:{
        url:"http://localhost/api/rafa/ale",
        pathname:"/api/rafa/ale",
        method:"POST"
    }
});



