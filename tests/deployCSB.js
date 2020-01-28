require('../../../psknode/bundles/csbBoot');
require('../../../psknode/bundles/pskruntime');
require('../../../psknode/bundles/psknode');
require('../../../psknode/bundles/edfsBar');
require('../../../psknode/bundles/virtualMQ');


const pskdomain = require('../../../modules/pskdomain');
const vmqAddress = `http://127.0.0.1:8080`;

pskdomain.ensureEnvironmentIsReady(vmqAddress);
$$.securityContext.generateIdentity((err, agentId) => {

    pskdomain.createConstitutionFromSources(['../../../modules/swarm-engine','../../../libraries/basicTestSwarms'], (err, constitutionPath) => {

        pskdomain.deployConstitutionCSB(constitutionPath, (err, seedBuffer) => {

            const seed = seedBuffer.toString();
            console.log("Seed:",seed);

        })
    });
});



