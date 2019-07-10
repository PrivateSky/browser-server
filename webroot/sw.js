let version ="sw-v1";
let name = "NoNameSw";

console.log(version, ": Creating service worker");
self.addEventListener('activate', function (event) {
    console.log("Activating service worker", event);
});

self.addEventListener('fetch', function (event) {
    console.log(version,": requesting", name, event.request.url);

    event.respondWith(new Promise((resolve) => {
        var status = {"status": 200, "statusText": "Success"};

        var blob = new Blob([name], {type: "text"});
        let response = new Response(blob, status);
        resolve(response);
    }));

    /*if (event.request.url.endsWith("extract") && event.request.method === "GET") {

    }*/

});

