let channelManagerInstance = null;
let Queue = require("swarmutils").Queue;
const maxQueueSize = 100;
const TOKEN_PLACEHOLDER = "WEB_TOKEN_PLACEHOLDER";
const queues = {};
const subscribers = {};


function _getSubscribersList(channelName) {
    if (typeof subscribers[channelName] === "undefined") {
        subscribers[channelName] = [];
    }

    return subscribers[channelName];
}

function _getQueue(name) {
    if (typeof queues[name] === "undefined") {
        queues[name] = new Queue();
    }

    return queues[name];
}

function _deliverMessage(subscribers, message) {
    let dispatched = false;
    try {
        while (subscribers.length > 0) {
            let subscriberCallback = subscribers.pop();
            if (!dispatched) {
                subscriberCallback(undefined, message);
                dispatched = true;
            } else {
                let e = new Error("Already dispatched");
                callback(e);
            }
        }
    } catch (err) {
        //... some subscribers could have a timeout connection
        if (subscribers.length > 0) {
            deliverMessage(subscribers, message);
        }
    }

    return dispatched;
}

function createChannel(channelName, callback) {
    if (typeof queues[channelName] !== "undefined") {
        let e = new Error("Channel exists!");
        e.code = 409;
        return callback(e);
    }

    queues[channelName] = new Queue();
    callback(undefined, TOKEN_PLACEHOLDER);
}

function sendMessage(channelName, message, callback) {

    let queue = _getQueue(channelName);
    let subscribers = _getSubscribersList(channelName);
    let dispatched = false;
    if (queue.isEmpty()) {
        dispatched = _deliverMessage(subscribers, message);
    }

    if (!dispatched) {
        if (queue.length < maxQueueSize) {
            queue.push(message);

        } else {
            //queue is full
            let e = new Error("Queue is full");
            e.code = 429;
            return callback(e);
        }

    }

}

function receiveMessage(channelName, callback) {
    if (!queues[channelName]) {
        let e = new Error("Channel does not exits");
        e.code = 403;
        return callback(e);
    }

    let queue = queues[channelName];
    let message = queue.pop();

    if (!message) {
        _getSubscribersList(channelName).push(callback);
    } else {
        callback(undefined, message);
    }

}

function ChannelsManager() {

    if (!channelManagerInstance) {
        this.createChannel = createChannel;
        this.sendMessage = sendMessage;
        this.receiveMessage = receiveMessage;
        channelManagerInstance = this;
        console.log("ChannelsManager initialised!");
    }
    return channelManagerInstance;
}


module.exports.ChannelsManager = new ChannelsManager();