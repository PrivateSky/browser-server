let version ="child";


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

    if(version == "child"){
        var pos = event.request.url.lastIndexOf("/");
        version+=":";
        version += event.request.url.substr(pos + 1);
        console.log("Renaming child to ", version);
    }

    event.respondWith(new Promise((resolve) => {
        var status = {"status": 200, "statusText": "Success"};

        var blob = new Blob(["I am " +version], {type: "text"});
        let response = new Response(blob, status);
        resolve(response);
    }));

    /*if (event.request.url.endsWith("extract") && event.request.method === "GET") {

    }*/

});

