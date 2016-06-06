(function(chrome) {

    var ports = [];
    chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === 'analytics') {
        ports.push(port);
        port.onDisconnect.addListener(function() {
            var i = ports.indexOf(port);
            if (i !== -1) {
                ports.splice(i, 1);
            }
        });
    } 
    });

    function notifyAnalyticsEvent(analyticsEvent) {
        ports.forEach(function(port) {
            port.postMessage(analyticsEvent); 
        });
    }

    // TODO make urls configurable
    chrome.webRequest.onBeforeRequest.addListener(
            function(details) {
                chrome.tabs.get(parseInt(details.tabId), function(tab) {
                    notifyAnalyticsEvent({
                        timestamp: details.timeStamp,
                        url: details.url,
                        origin: tab.url
                    });
                });
            },
            {
                urls: [
                    "http://*.anametrix.com/*",
                    "http://ypghits.yellowpages.ca/*",
                    "http://*.amplitude.com/*"
                ]
            });

})(chrome);


