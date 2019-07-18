const unsupportedMethods = ["append","redirect", "location", "links", "jsonp", "render", "sendFile"];
const unsupportedProperties = ["app","headersSent","locals"];

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
    let statusCode = undefined;

    this.attachment = function (path) {
        //TOOD read from path using browserfs or EDFS

        let string = "This is a text!";

        let fileBlob = new Blob([string],{
            type: "application/octet-stream"
        });

        let init = {
            status: 200, statusText: "OK", headers: {
               "Content-Disposition": ' attachment; filename="rafa.txt"',
               "Content-Type": "text/plain"
            }
        };
        event.sendResponse(fileBlob,init);
    };


    this.get = function (field) {

    };
    /**
     * Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter
     * converted to a JSON string using JSON.stringify().
     * The parameter can be any JSON type, including object, array, string, Boolean, number, or null, and you can
     * also use it to convert other values to JSON.
     * @param body
     */
    this.json = json => {
        let jsonResponse = new Blob([JSON.stringify(json)], {type: "application/json"});
        event.sendResponse(jsonResponse, this.statusCode);
    };

    this.status = status =>{
        statusCode = status;
        return this;
    };
    this.send = body =>{
        event.sendResponse(body, statusCode);
    };
    this.end = () =>{
        event.sendResponse("", statusCode);
    };


    /**
     * Add handlers for unimplemented methods
     * TODO extract these and see also @EventRequest
     */
    unsupportedProperties.forEach(unsupportedProperty => {
        Object.defineProperty(this, unsupportedProperty, {
            get: function () {
                throw new Error("Property " + unsupportedProperty + " is not supported!")
            }
        })
    });

    unsupportedMethods.forEach(unsupportedMethod => {
        Object.defineProperty(this, unsupportedMethod, {
            get: function () {
                throw new Error("Method " + unsupportedMethod + " is not supported!")
            }
        })
    });
}

exports.EventResponse = EventResponse;
