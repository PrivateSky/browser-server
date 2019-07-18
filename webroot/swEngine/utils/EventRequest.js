const unsupportedMethods = ["acceptsCharsets", "acceptsEncodings", "acceptsLanguages", "param", "is", "range"];
const unsupportedProperties = ["app","fresh","ip","ips","signedCookies","stale","subdomains","xhr"];


/**
 * Extract query params from url
 * @param url
 */
function extractQueryParams (url){

    let searchParams = url.searchParams;
    let queryParams = {};

    for (let pair of searchParams.entries()) {
        queryParams[pair[0]] = pair[1];
    }
    return queryParams;
}

function EventRequest(event) {

    this.body = event.request.body;
    this.method = event.request.method;
    this.originalUrl = event.request.url;
    let url = new URL(this.originalUrl);
    this.path = url.pathname;
    this.hostname = url.hostname;
    this.protocol = url.protocol;
    this.params = {};
    this.query = extractQueryParams(url);
    this.secure = this.protocol === "https";



    /**
     * Checks if the specified content types are acceptable, based on the request’s Accept HTTP header field.
     * The method returns the best match, or if none of the specified content types is acceptable, returns false
     * (in which case, the application should respond with 406 "Not Acceptable").
     * The type value may be a single MIME type string (such as “application/json”), an extension name such as “json”,
     * a comma-delimited list, or an array. For a list or array, the method returns the best match (if any).
     * @param types
     */
    this.accepts = function(types){
        throw new Error("Unimplemented method!");
    };

    /**
     * Returns the specified HTTP request header field (case-insensitive match). The Referrer and Referer fields are interchangeable.
     * @param field
     */
    this.get = function(field){
        throw new Error("Unimplemented method!");
    };

    /**
     * Add handlers for unimplemented methods
     * TODO extract these and see also @EventResponse
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

exports.EventRequest = EventRequest;
