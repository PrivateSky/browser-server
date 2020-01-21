function IframesManager(){
    const iframes = {};

    document.addEventListener("DOMNodeRemoved", (evt) => {
        let removedNode = evt.target;

        if (removedNode.tagName.toLowerCase() === "iframe") {
            for (let identity in iframes) {
                if (iframes[identity] === removedNode) {
                    this.removeIframe(identity);
                    break;
                }
            }
        }

    }, true);

    this.addIframe = function (identity, iframe) {

        if(!iframes[identity]){
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
        console.log(`Removing iframe with identity ${identity}`);
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