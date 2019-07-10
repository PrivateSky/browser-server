const version = "swr_v6::"

const staticCacheName = `${version}static-resources`;

let offlineStuff = [
    '/sw.js',
    '/sw-root.js',
    '/index.html',
    '/appIndex.html'
]

//const cachePrefix = "https://raw.githubusercontent.com/PrivateSky/browser-server/master/webroot";
//const cachePrefix = "https://localhost:8080";

const cachePrefix = "http://192.168.1.7:8080";


offlineStuff = offlineStuff.map((item)=>{
    return cachePrefix+item;
});

console.log(version,":caching...", offlineStuff);

self.addEventListener('install', (event) => {
    console.log(version,'doing installation');
    // pre cache a load of stuff:
    event.waitUntil(
        caches
            .open(staticCacheName)
            .then((cache) => {
                console.log(version,":Preparing Cache");
                /*cache.add('https://raw.githubusercontent.com/PrivateSky/browser-server/master/webroot/appIndex.html')
                cache.add('https://raw.githubusercontent.com/PrivateSky/browser-server/master/webroot/index.html')
                cache.add('https://raw.githubusercontent.com/PrivateSky/browser-server/master/webroot/sw.js')
                cache.add('https://raw.githubusercontent.com/PrivateSky/browser-server/master/webroot/sw-root.js')
                 */
                cache.add('http://localhost:8080/index.html');
                return cache.addAll(offlineStuff);
            })
            .then(() => {
                console.log(version,': install completed');
            }).catch(function(err){
            console.log(err);
            })
    )
});

self.addEventListener('activate',  (event) => {
    event.waitUntil(
        caches
            .keys()
            .then( (keys) => {
                // We return a promise that settles when all outdated caches are deleted.
                return Promise.all(
                    keys
                        .filter( (key) => {
                            // Filter by keys that don't start with the latest version prefix.
                            return !key.startsWith(version);
                        })
                        .map( (key) => {
                            console.log("deleting:",key);
                            return caches.delete(key);
                        })
                ).catch(function(err){
                    console.log(err);
                });
            })
            .then(() => {
                console.log(version,': activate completed.');
            }).catch(function(err){
            console.log(err);
            })
    )
    try{
        clients.claim();
    } catch(err){
        console.log(err);
    }

});


self.addEventListener('fetch', (event) => {
    console.log(version,": got request for ", event.request.url);
    event.respondWith(
        // Try the cache
        caches.match(event.request, {ignoreSearch:true}).then((response) => {
            // Fall back to network
            if (!response) throw Error("No data");
            console.log(version, response ? " from cache:" + response.url : 'nothing in cache for:' + event.request.url)
            return response || fetch(event.request);
        }).catch((err) => {
            let str = event.request.url;
            let newUrl = str;
            if(str.indexOf("~") != -1){
                newUrl = cachePrefix + str.substring(str.indexOf("~") + 1);
            }
            event.request.url =  newUrl;
            console.log(version,':No cache', event.request.url, "loading from ", newUrl);
            return caches.open(version + 'fundamentals').then((cache) => {
                return fetch(newUrl).then((response) => {
                    console.log(version, ':Response for', response.url, " from ", newUrl)
                    cache.put(event.request, response.clone());
                    return response;
                }).catch(function(err){
                    console.log(err);
                });
            }).catch(function(err){
                console.log(err);
            })
        }).catch(function(err){
            console.log(err);
        })
    );
});