function IframesManager(){
    const iframes = {};

    this.addIframe = function (identity, iframe) {

        if(!iframes[identity]){
            //TODO: remove if properly - this code is not working
            iframe.contentWindow.onbeforeunload = function () {
                console.log("REMOVED");
                this.removeIframe(identity);
            };

            iframes[identity] = iframe;
        }
        else{
            console.log("An iframe was already set for this identity!")
        }

    };

    this.getIframe = function (identity) {
        if(iframes[identity]){
            return iframes[identity];
        }
        else{
            console.error(`No iframe with identity ${identity} was found.`)
        }
        return null;
    };

    this.removeIframe = function(identity){
        if(iframes[identity]){
            delete iframes[identity];
            return true;
        }
        else{
            console.error(`No iframe with identity ${identity} was found.`)
        }
        return false;
    }

}

let iframesManagerInstance =  new IframesManager();

module.exports.getIframesManager = function () {
    return iframesManagerInstance;
};