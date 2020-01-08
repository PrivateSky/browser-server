function InnerServiceWorkerPC() {
    const channelsManager = require("./ChannelsManager").getChannelsManager();
    const SwarmPacker = require("swarmutils").SwarmPacker;

    this.sendSwarm = function (swarmSerialization) {

        let channelName;
        let header;

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


}

module.exports = InnerServiceWorkerPC;