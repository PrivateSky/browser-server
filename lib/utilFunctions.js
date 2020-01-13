function prepareMessage(req, callback){
    const contentType = req.headers['content-type'];
    if (contentType === 'application/octet-stream') {
        const contentLength = Number.parseInt(req.headers['Content-Length'], 10);

        if(Number.isNaN(contentLength)){
            let e = new Error("Length Required");
            e.code = 411;
            return callback(e);
        }
        else{
            callback(undefined,req.body);
        }

    } else {
        let e = new Error("Wrong message format received!");
        e.code = 500;
        callback(e);
    }
}
module.exports.UtilFunctions = {prepareMessage};