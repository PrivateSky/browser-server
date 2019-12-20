const browserify = require("browserify");
const fs = require("fs");
let b = browserify();
b.require("../browserfs-dist",{expose:"browserfs-dist"});
b.require("../adler32",{expose:"adler32"});
b.require("../pskcrypto",{expose:"pskcrypto"});
b.require("../pskwebfs",{expose:"fs"});
b.require("../swarmutils",{expose:"swarmutils"});
b.require("../bar",{expose:"bar"});
b.require("../psk-http-client",{expose:"psk-http-client"});
b.require("../edfs-brick-storage",{expose:"edfs-brick-storage"});
b.add("webroot/swEngine/index.js");
b.bundle().pipe(fs.createWriteStream('./webroot/sw-browserified.js'))
