const version = "swr_v6::"

const staticCacheName = `${version}static-resources`;

//const cachePrefix = "https://raw.githubusercontent.com/PrivateSky/browser-server/master/webroot";
//const cachePrefix  = "https://cdn.jsdelivr.net/gh/PrivateSky/browser-server/webroot";
const cachePrefix = "http://192.168.1.30:8080";




self.addEventListener('activate',  (event) => {
    try{
        clients.claim();
    } catch(err){
        console.log(err);
    }

});


function createResponse(event) {
    return new Promise((resolve) => {
        let str = event.request.url;
        let newUrl = str;
        if (str.indexOf("~") != -1) {
            newUrl = cachePrefix + str.substring(str.indexOf("~") + 1);
        }
        //event.request.url =  newUrl;

        var mimeType = (newUrl.indexOf(".js") != newUrl.length - 3)?'text/html':'text/javascript';
        console.log("Loading resource from:",newUrl, mimeType);

        return fetch(newUrl).then((remoteReponse) => {
            var init = {"status": 200, "statusText": "File was successfully extracted"};
            remoteReponse.text().then(text => {
                var blob = new Blob([text], {type: mimeType});
                let response = new Response(blob, init);
                //cache.put(event.request, response);
                resolve(response);
            });
        });
    });
}

self.addEventListener('fetch', (event) => {
    console.log(version, ": got request for ", event.request.url);
    event.respondWith(createResponse(event));

});