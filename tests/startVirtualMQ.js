require('../../../psknode/bundles/csbBoot');
require('../../../psknode/bundles/pskruntime');
require('../../../psknode/bundles/psknode');
require('../../../psknode/bundles/edfsBar');
require('../../../psknode/bundles/virtualMQ');

const virtualMQ = require('virtualmq');

virtualMQ.createVirtualMQ("8080", "tmp", '', err => {
    if (err) {
     console.log(err);
    }
    else{
        console.log("VirtualMQ running on port 8080");
    }

});
