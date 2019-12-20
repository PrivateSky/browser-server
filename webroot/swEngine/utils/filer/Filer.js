require("edfs-brick-storage");
const bar = require("bar");


function Filer(){

    this.addFolder = function(folderPath, callback){
        this.archive.addFolder(folderPath, callback);
    };

    this.extractFolder = function(folderPath, callback){
        this.archive.extractFolder(folderPath, callback);
    }
}

Filer.prototype.init = function(storageProvider, url){

    /*const ArchiveConfigurator = bar.ArchiveConfigurator;
    const createFsAdapter = bar.createFsBarWorker;
    ArchiveConfigurator.prototype.registerDiskAdapter("fsAdapter", createFsAdapter);
    const archiveConfigurator = new ArchiveConfigurator();
    archiveConfigurator.setDiskAdapter("fsAdapter");
    archiveConfigurator.setBufferSize(256);
    archiveConfigurator.setStorageProvider(storageProvider, url);
    this.archive = new bar.Archive(archiveConfigurator);*/

};
exports.Filer = new Filer();