function streamToBuffer(stream, bufferSize, callback) {
    const buffer = Buffer.alloc(bufferSize);
    let currentOffset = 0;

    stream.on('data', function (chunk) {
        const chunkSize = chunk.length;
        const nextOffset = chunkSize + currentOffset;

        if (currentOffset > bufferSize - 1) {
            stream.close();
            return callback(new Error('Stream is bigger than reported size'));
        }

        write2Buffer(buffer, chunk, currentOffset);
        currentOffset = nextOffset;

    });
    stream.on('end', function () {
        callback(undefined, buffer);
    });
    stream.on('error', callback);
}

function write2Buffer(buffer, dataToAppend, offset) {
    const dataSize = dataToAppend.length;

    for (let i = 0; i < dataSize; i++) {
        buffer[offset++] = dataToAppend[i];
    }
}


function prepareMessage(req, callback){
    const contentType = req.headers['content-type'];
    if (contentType === 'application/octet-stream') {
        const contentLength = Number.parseInt(req.headers['content-length'], 10);

        if(Number.isNaN(contentLength)){
            let e = new Error("Length Required");
            e.code = 411;
            return callback(e);
        }
        else{
            streamToBuffer(req, contentLength, (err, bodyAsBuffer) => {
                if(err) {
                    err.code = 500;
                    return callback(err);
                }

                callback(undefined, bodyAsBuffer);
            });
        }

    } else {
        let e = new Error("Wrong message format received!");
        e.code = 500;
        callback(e);
    }
}
module.exports.UtilFunctions = {prepareMessage};