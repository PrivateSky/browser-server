function IframePowerCord(iframe){
    const IframesManager = require("../IframesManager").getIframesManager();

    this.sendSwarm = function (swarmSerialization){
        const SwarmPacker = require("swarmutils").SwarmPacker;

        let header;
        try {
            header = SwarmPacker.getHeader(swarmSerialization);
        }
        catch (e) {
            console.error("Could not deserialize swarm");
        }

        let iframe = IframesManager.getIframe(header.swarmTarget);
        iframe.contentWindow.postMessage(swarmSerialization, iframe.src);
    };

    let receivedMessageHandler  = (event)=>{
        const SwarmPacker = require("swarmutils").SwarmPacker;

        if (event.source !== window) {
            console.log("Message received in parent", event);
            this.transfer(event.data);
        }

    };

    let subscribe = () => {

        if(this.identity && this.identity!=="*"){
            IframesManager.addIframe(this.identity, iframe);
        }

        if(!window.iframePCMessageHandler){
            window.iframePCMessageHandler = receivedMessageHandler;
            window.addEventListener("message",receivedMessageHandler)
        }
    };

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if(p === 'identity') {
                subscribe.call(target);
            }
        }
    });
}

module.exports = IframePowerCord;