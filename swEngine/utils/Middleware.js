//see as example https://github.com/PrivateSky/virtualmq/blob/master/libs/http-wrapper/src/classes/Middleware.js

function Middleware() {
    let acceptedMethods = ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE"];
    let handlers = {}; // an object of handlers
    //it is important to have the order of handlers from registry to ensure that a event is checked and pass
    //to each handler in the correct order


    function unifyArguments(params) {
        let args = ["*", "*", undefined];
        switch (params.length) {
            case 0:
                throw new Error('Use method needs at least a handler argument.');
            case 1:
                if (typeof params[0] !== 'function') {
                    throw new Error('If only one argument is provided it must be a function');
                }
                args[2] = params[0];
                break;
            case 2:
                if (typeof params[0] !== "string" || typeof params[1] !== "function") {
                    throw new Error('If two arguments are provided the first one must be a string (url) and the second a function');
                }
                if(params[0][0] !== "/"){
                    throw new Error("First argument doesn't look like a path");
                }
                args[0] = params[0];
                args[2] = params[1];
                break;

            default:
                if (typeof params[0] !== 'string' || typeof params[1] !== 'string' || typeof params[2] !== 'function') {
                    throw new Error('If three or more arguments are provided the first one must be a path (url), the second one should be a HTTP verb and the third a function');
                }
                if(params[0][0] !== "/"){
                    throw new Error("First argument doesn't look like a path");
                }

                if (acceptedMethods.indexOf(params[1].toUpperCase()) === -1) {
                    throw new Error('Your second argument should be one HTTP verb. Supported HTTP verbs are ' + acceptedMethods);
                }
                args = params.slice(0, 3);
                break;

        }
        return args;
    }
/*
TODO: document all functions!!!!
* */
    function findPathCandidates(requestPath, method) {

        let candidates = [];

        function checkMatch(pathParts, requestParts) {

            let result = {
                params: {},
                match: true
            };

            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i].startsWith(":")) {
                    result.params[pathParts[i].substring(1)] = requestParts[i];
                }
                else {
                    result.match = pathParts[i] === requestParts[i]
                }
            }
            return result;
        }

        let requestParts = requestPath.split("/");

        if (requestParts.length > 1) {
            requestParts.shift();
        }

        console.log(handlers);

        Object.keys(handlers).forEach((path) => {

            let pathParts = path.split("/");
            /*if (pathParts.length > 1) {
                pathParts.shift();
                if (pathParts.length === requestParts.length) {
                    let result = checkMatch(pathParts, requestParts);
                    if (result.match) {
                        let allowedMethods = Object.keys(handlers[path]);
                        if (allowedMethods.includes("*") || allowedMethods.includes(method))
                            handlers[path][method].forEach(handler=>{
                                candidates.push(handler);
                            })

                    }
                }
            }*/
            for(let i = 0; i<pathParts.length; i++){
                let part = pathParts[i];
                if(part === ""){
                    continue;
                }

                if(part[0] === ":"){
                    // it is a var

                    //... continue;
                }


            }
        });

        return candidates;

    }

    /*
    used for testing
     */
    this.fakeRequest = function (path, method) {
        let handlers = findPathCandidates(path, method);

        let index = 0;

        let event = {event:"Some custom event"};


        function executeNextHandler(event, index){
            handlers[index](event, ()=>executeNextHandler(event, ++index))
        }

        executeNextHandler(event, index);


    };

    this.use = function (...params) {
        console.log(params);
        let args = unifyArguments(params);

        if (!handlers[args[0]]) {
            handlers[args[0]] = {};
        }

        if (!handlers[args[0]][args[1]]) {
            handlers[args[0]][args[1]] = [];
        }
        handlers[args[0]][args[1]].push(args[2])

    };

    this.handleEvent = function (event) {

        let url = new URL(event.request.url);
        let pathname = url.pathname;
        let searchParams = {};
        url.searchParams.forEach((key, value) => searchParams[key] = value);


    };


    this.listAllHandlers = function () {
        return handlers;
    };

    /*
    *  use(handler);
    *  use(path, handler);
    *  use(path, method, handler);
    *
    * */

    /**
     * path poate sa arate asa /:csbid/vmq/:channelId
     * cand se face match pe un path trebuiesc extrase variabilele din path
     */

    /*
    * method can be: get, post, put, delete, options etc
    * */

    /*
    *  handler should be a function(event, next){...}
    *  next is a callback that tells the middleware to continue with matching other handlers...
    * */

    this.get = function (path, handler) {
        this.use(path, "GET", handler)
    };

    this.post = function (path, handler) {
        this.use(path, "POST", handler)
    };

    //wrapper over use method in order to ensure that use defined api will have the path match /:csbid/API/....
    this.registerAPI = function (path, method, handler) {

    };

}

exports.Middleware = Middleware;
