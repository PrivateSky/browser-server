function Hub(callback){
    let spokes = {};

    this.addSpoke = function(name, wnd, uri){
        spokes[name] = {wnd, uri};
        window.addEventListener("message", receiveMessage, false);

        function receiveMessage(event) {
            callback(event.data, name, event);
        }
    }

    this.sendMessage = function(name, obj){
        spokes[name].wnd.postMessage(obj,spokes[name].uri);
    }
}


function Spoke(window, callback){
    let parent = null;

    this.sendMessage = function (obj){
        parent.postMessage(obj);
    };

    window.addEventListener("message", receiveMessage, false);

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

export function createHub() {
    return new Hub();
}

export function createSpoke() {
    return new Spoke();
}