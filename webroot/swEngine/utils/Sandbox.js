//The sandbox is responsible for the execution of the transaction received thru VMQ
//once the transaction is executed will return the result to the application

_$$_.soundpubSub.subscribe("SWARM_FOR_EXECUTION", function(swarm){
    console.log("I got the swarm ... now preparing to execute...");
});







server.post("/:csbui/vmq/inbound", function(event, next){
    _$$_.soundpubSub.publish("SWARM_FOR_EXECUTION", event.params.swarm);
});
