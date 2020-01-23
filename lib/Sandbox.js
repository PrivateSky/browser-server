const ServiceWorkerPC = require("./ServiceWorkerPC.js");
// const se = require("swarm-engine");
//
// se.initialise("*");
//
// $$.swarms.describe("echo", {
//     say: function(message){
//         setTimeout(()=>{
//             this.return(null, message+"O");
//         },2000);
//
//     }
// });
//
// /*
// *  InnerServiceWorkerPowerCord in functia de sendSwarm verifica SwarmTargetul din header
// *  si daca este de tip URL trebuie sa puna in canalul extrax din swarmTarget
// * */
// let pc = new ServiceWorkerPC();
//
//
// $$.swarmEngine.plug("*", pc);
//
//
//
// let swPskAdmin = require("./ServiceWorkerPskAdmin").getServiceWorkerPskAdmin();
//
//
// $$.swarms.describe("csbDeploy", {
//     start: function(seed){
//         swPskAdmin.getConstitutionFilesFromBar(seed, (err, constitutionBundles) =>{
//             if(!err){
//                 this.return(null);
//                 constitutionBundles.forEach(bundle => eval(bundle.toString()));
//             }
//         });
//
//     }
// });
//

