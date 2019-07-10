let version ="ChildSw-v3";


console.log(version, ": Creating service worker");
self.addEventListener('activate', function (event) {
    console.log(version ,":Activating service worker", event);
    try{
        clients.claim();
    } catch(err){
        console.log(err);
    }

});

self.addEventListener('fetch', function (event) {
    console.log(version,": requesting", event.request.url);

    event.respondWith(new Promise((resolve) => {
        var status = {"status": 200, "statusText": "Success"};

        var blob = new Blob([version+":"+event.request.url], {type: "text"});
        let response = new Response(blob, status);
        resolve(response);
    }));

    /*if (event.request.url.endsWith("extract") && event.request.method === "GET") {

    }*/

});

