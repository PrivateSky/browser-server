function ServiceWorkerPSKAdmin(edfsURL){
    const EDFS = require('edfs');

    const brickStorageStrategyName = "http";
    const hasHttpStrategyRegistered = $$.brickTransportStrategiesRegistry.has(brickStorageStrategyName);

    if (!hasHttpStrategyRegistered) {
        $$.brickTransportStrategiesRegistry.add(brickStorageStrategyName, EDFS.createHTTPBrickTransportStrategy(edfsURL));
    }


    function readConstitutionFrom(archive, callback) {

        archive.listFiles('constitutions', (err, files) => {
            if (err) {
                return callback(err);
            }

            asyncReduce(files, __readFile, [], callback);
        });


        function __readFile(pastFilesContent, filePath, callback) {
            archive.readFile(filePath, (err, fileContent) => {
                if (err) {
                    return callback(err);
                }

                pastFilesContent.push(fileContent);
                callback();
            });
        }
    }


    this.getConstitutionFilesFromBar = function (seed, callback) {
        const brickStorageStrategyName = "http";

        const edfs = EDFS.attach(brickStorageStrategyName);
        const constitutionBAR = edfs.loadBar(seed);

        readConstitutionFrom(constitutionBAR, callback)
    }
}


let serviceWorkerPSKAdminInstance = new ServiceWorkerPSKAdmin("http://localhost:8080");
module.exports.getServiceWorkerPskAdmin = function(){
    return serviceWorkerPSKAdminInstance;
};