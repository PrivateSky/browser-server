function Hub(callback){
    let spokes = {};

    this.addSpoke = function(childName, wnd, uri){
        spokes[childName] = {wnd, uri};
    }

    this.sendMessage = function(name, obj){
        spokes[name].wnd.postMessage(obj,spokes[name].uri);
    }

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        //console.log("Received in Hub:", event, spokes);
        for(var n in spokes){ //TODO: how we can keep it secure but remove this this search in for!?
            if(spokes[n].wnd === event.source){
                callback( n, event.data, event);
                return;
            }
        }
    }
}


function Spoke(callback){
    let parent = null;

    this.sendMessage = function (obj){
        parent.postMessage(obj);
    };

    window.addEventListener("message", receiveMessage);

    function receiveMessage(event) {
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