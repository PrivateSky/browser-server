const unsupportedMethods = ["acceptsCharsets", "acceptsEncodings", "acceptsLanguages", "param", "is", "range"];
const unsupportedProperties = ["ip","ips",];
function extractIpFromUrl(url){

}

function EventRequest(event) {

    this.body = event.request.body;
    this.method = event.request.method;
    this.originalUrl = event.request.url;
    this.path = new URL(this.originalUrl).pathname;
    this.params = event.request.params;
    this.query = event.request.query;

    /**
     * Checks if the specified content types are acceptable, based on the request’s Accept HTTP header field.
     * The method returns the best match, or if none of the specified content types is acceptable, returns false
     * (in which case, the application should respond with 406 "Not Acceptable").
     * The type value may be a single MIME type string (such as “application/json”), an extension name such as “json”,
     * a comma-delimited list, or an array. For a list or array, the method returns the best match (if any).
     * @param types
     */
    this.accepts = function(types){

    };

    /**
     * Returns the specified HTTP request header field (case-insensitive match). The Referrer and Referer fields are interchangeable.
     * @param field
     */
    this.get = function(field){

    };
}

exports.EventRequest = EventRequest;
