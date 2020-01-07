const browserify = require("browserify");
let b = browserify();
const fs = require("fs");
b.require("../swarmutils",{expose:"swarmutils"});
b.add("webroot/swEngine/index.js");
b.bundle().pipe(fs.createWriteStream('./webroot/sw-browserified.js'))
