const unsupportedMethods = ["redirect", "location", "links", "jsonp", "render", "sendFile"];


/*
* sendResponse instance method used to send reponse on event
***/
FetchEvent.prototype.sendResponse = function(response, status){
    let eventStatus = status || {"status": 200, "statusText": "ok"};
    let eventResponse = response || "";

    this.respondWith(new Promise((resolve) => {
        let response = new Response(eventResponse, eventStatus);
        resolve(response);
    }));
};

function EventResponse(event){
    this.app = "";
    this.headerSent = false;
    this.locals = {};
    this.statusCode = undefined;

    unsupportedMethods.forEach((methodName) => {
        this[methodName] = function () {
            throw new Error("Unimplemented method!");
        }
    });

    /**
     * it should returns the HTTP response header specified by field. The match is case-insensitive.
     * @param field
     */

    /**
     *
     */
    this.attachment = function () {

    }

    this.get = function (field) {

    }
    /**
     * Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter
     * converted to a JSON string using JSON.stringify().
     * The parameter can be any JSON type, including object, array, string, Boolean, number, or null, and you can
     * also use it to convert other values to JSON.
     * @param body
     */
    this.json = function (body) {

    };
    this.status = function(status){
        this.statusCode = status;
    };
    this.send = function(body){
        event.sendResponse(body, this.statusCode);
    }
}

exports.EventResponse = EventResponse;
