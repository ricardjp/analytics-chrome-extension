(function(chrome) {

    var trackers = [
        {
            name: 'Anametrix',
            mask: 'http://*.anametrix.com/*',
            
        }
    ];

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
    
    function findTracker(urlObject) {
        if (urlObject.hostname.match(/\.anametrix\.com$/)) {
            return 'Anametrix';
        } else if (urlObject.hostname.match(/^ypghits\.yellowpages\.ca$/)) {
            return 'YP Analytics';
        } else if (urlObject.hostname.match(/^api\.amplitude\.com$/)) {
            return 'Amplitude';
        } else {
            return 'Unknown';
        }
    }

    // TODO make urls configurable
    chrome.webRequest.onBeforeRequest.addListener(
            function(details) {
                chrome.tabs.get(parseInt(details.tabId), function(tab) {
                    
                    var urlObject = new UrlParser(details.url).parseUrl(); 
                    
                    notifyAnalyticsEvent({
                        timestamp: details.timeStamp,
                        url: urlObject,
                        origin: tab.url,
                        requestBody: details.requestBody,
                        tracker: findTracker(urlObject)
                    });
                });
            },
            {
                urls: [
                    "http://*.anametrix.com/*",
                    "http://ypghits.yellowpages.ca/*",
                    "http://*.amplitude.com/*"
                ]
            },
            ['requestBody']);

})(chrome);