function Hub(callback){
    let spokes = {};

    this.addSpoke = function(childName, wnd, uri){
        spokes[childName] = {wnd, uri};
        window.addEventListener("message", receiveMessage, false);

        function receiveMessage(event) {
            callback( childName, event.data, event);
        }
    }

    this.sendMessage = function(name, obj){
        spokes[name].wnd.postMessage(obj,spokes[name].uri);
    }
}


function Spoke(callback){
    let parent = null;

    this.sendMessage = function (obj){
        parent.postMessage(obj);
    };

    window.addEventListener("message", receiveMessage);

    function receiveMessage(event) {
        console.log("Receiving in child...");
        if(!parent){
            parent = event.source;
        }
        /*if (event.origin !== "http://example.org:8080")
            return;
        */
        callback(event.data);
    }
}

export function createHub(callback) {
    return new Hub(callback);
}

export function createSpoke(callback) {
    return new Spoke(callback);
}