const browserify = require("browserify");
const fs = require("fs");
let b = browserify();
b.require("./webroot/swEngine/externals/browserfs-dist",{expose:"browserfs-dist"});
b.require("./webroot/swEngine/externals/pskwebfs",{expose:"pskwebfs"});
b.require("./webroot/swEngine/externals/pskwebfs",{expose:"fs"});
b.require("./webroot/swEngine/externals/swarmutils",{expose:"swarmutils"});
b.require("./webroot/swEngine/externals/bar",{expose:"bar"});
b.require("./webroot/swEngine/externals/psk-http-client",{expose:"psk-http-client"});
b.require("./webroot/swEngine/externals/edfs-brick-storage",{expose:"edfs-brick-storage"});
b.add("webroot/swEngine/index.js");
b.bundle().pipe(fs.createWriteStream('./webroot/sw-browserified.js'))
