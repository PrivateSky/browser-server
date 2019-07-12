//see as example https://github.com/PrivateSky/virtualmq/blob/master/libs/http-wrapper/src/classes/Middleware.js

function Middleware() {
    let acceptedMethods = ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE"];
    let registeredHandlers = []; // an object of handlers
    //it is important to have the order of handlers from registry to ensure that a event is checked and pass
    //to each handler in the correct order


    /*TODO* document function*/
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
                if (params[0][0] !== "/") {
                    throw new Error("First argument doesn't look like a path");
                }
                args[0] = params[0];
                args[2] = params[1];
                break;

            default:
                if (typeof params[0] !== 'string' || typeof params[1] !== 'string' || typeof params[2] !== 'function') {
                    throw new Error('If three or more arguments are provided the first one must be a path (url), the second one should be a HTTP verb and the third a function');
                }
                if (params[0][0] !== "/") {
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
    function findPathCandidates(requestPath, requestMethod) {

        let candidates = [];

        function checkMethod(method) {
            if (method === "*") {
                return true;
            }
            return method === requestMethod
        }

        function checkMatch(pathParts, requestParts) {

            let result = {
                params: {},
                match: true
            };
            if (pathParts.length === 1 && pathParts[0] === "*") {
                return result;
            }

            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i].startsWith(":")) {
                    result.params[pathParts[i].substring(1)] = requestParts[i];
                    continue;
                }
                if (pathParts[i] === "*") {
                    continue;
                }

                if (pathParts[i] !== requestParts[i]) {
                    result.match = false;
                    break;
                }

            }
            return result;
        }

        function extractPathParts(path) {
            let pathParts = path.split("/");

            if (pathParts.length > 1) {
                if (pathParts[0] === "") {
                    pathParts.shift();
                }
            }
            return pathParts;
        }

        let requestPathParts = extractPathParts(requestPath);

        for (let i = 0; i < registeredHandlers.length; i++) {
            let registeredHandler = registeredHandlers[i];
            let handlerPathParts = extractPathParts(registeredHandler.path);

            if (!checkMethod(registeredHandler.method)) {
                continue;
            }

            let matchResult = checkMatch(handlerPathParts, requestPathParts);
            if (matchResult.match) {
                candidates.push(registeredHandler.handler);
            }
        }

        return candidates;
    }

    /*
    event handler execution
     */
    this.executeRequest = function (event) {

        let path = event.request.pathname;
        let method = event.request.method;
        let handlers = findPathCandidates(path, method);
        let index = 0;

        function executeNextHandler(event, index) {
            let nextHandler = handlers[index];
            if (typeof nextHandler === "function") {
                nextHandler(event, () => executeNextHandler(event, ++index));
            }
            else {
                /**
                 * TODO is this necessary?
                 */
                console.error("No more handlers triggered by next ");
            }
        }

        executeNextHandler(event, index);
    };

    this.use = function (...params) {
        let args = unifyArguments(params);

        registeredHandlers.push({
            path: args[0],
            method: args[1],
            handler: args[2]
        });

    };

    this.handleEvent = function (event) {

        let url = new URL(event.request.url);
        let pathname = url.pathname;
        let searchParams = {};
        url.searchParams.forEach((key, value) => searchParams[key] = value);


    };


    this.listAllHandlers = function () {
        return registeredHandlers;
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
