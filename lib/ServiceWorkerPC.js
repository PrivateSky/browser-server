function ServiceWorkerPC() {
    const channelsManager = require("./ChannelsManager").getChannelsManager();
    const SwarmPacker = require("swarmutils").SwarmPacker;

    this.sendSwarm = function (swarmSerialization) {
        let header;
        let channelName;

        try {
            header = SwarmPacker.getHeader(swarmSerialization);
        } catch (e) {
            console.error("Could not deserialize swarm");
        }

        //TODO
        //verifica header.target pt urmatoarele cazuri:
        // -- daca targetul este un regex de forma domain/agent/agentName atunci trebuie trimis mesajul cu ajutorul lui channelsManager pe canalul Base64(numeDomeniu)
        // -- daca targetul este un regex de forma http/https atunci trebuie verificat daca domeniul fake-uit de service worker coincide cu domeniul din url. Daca coincid atunci se trimite folosind channelsManagerul local daca nu coincide atunci se face un request http(s) (fetch)
        // -- default ???? - posibil sa fie nevoie sa intoarcem tot in swarm engine... NU SUNT SIGUR!!!


        let urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        let regex = new RegExp(urlRegex);

        if (header.swarmTarget.match(regex)) {
            let swarmTarget = header.swarmTarget;
            //Urls could end in "/" or not
            if (swarmTarget[swarmTarget.length - 1] === "/") {
                swarmTarget = swarmTarget.slice(0, -1);
            }

            let urlFragments = swarmTarget.split("/");
            channelName = urlFragments[urlFragments.length - 1];
            channelsManager.sendMessage(channelName,swarmSerialization,function(){
                //what now?
                console.log("done");
            });
        }

    };

    let receiveSwarmSerialization = (err, message) => {
        if (err) {
            console.log(err);
            if (err.code >= 400 && err.code < 500) {
                return;
            }
        } else {
            //we facilitate the transfer of swarmSerialization to $$.swarmEngine
            this.transfer(message);
        }
        //we need tp subscribe again in order to be called when a new message arrive
        //because no matter why error or message channelManager will remove as from the subs list
        setTimeout(subscribe, 0);
    };

    let subscribe = () => {
        //TODO
        //verifica this.identity pt urmatoarele cazuri:
        // -- daca targetul este un regex de forma domain/agent/agentName atunci trebuie trimis mesajul cu ajutorul lui channelsManager pe canalul Base64(numeDomeniu)
        // -- default ???? - posibil sa fie nevoie sa intoarcem tot in swarm engine... NU SUNT SIGUR!!!


        //let channelName = ""; //based on this.identity when need to extract the domainName from regex domainName/agent/agentname
        let channelName = this.identity.split("/")[0];//temporary test
        channelsManager.receiveMessage(btoa(channelName), receiveSwarmSerialization);
    }

    return new Proxy(this, {
        set(target, p, value, receiver) {
            target[p] = value;
            if (p === 'identity') {
                //when we get our identity
                //setup means first call of subscribe
                subscribe.call(target);
            }
        }
    });
}

module.exports = ServiceWorkerPC;