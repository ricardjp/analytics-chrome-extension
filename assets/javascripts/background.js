const urlParser = require('url');
const globber = require('glob-to-regexp');

const trackers = [
    {
        name: 'Anametrix',
        mask: '*://*.anametrix.com/*', 
    },
    {
        name: 'YP Analytics',
        mask: '*://ypghits.yellowpages.ca/*'
    },
    {
        name: 'Amplitude',
        mask: '*://api.amplitude.com/*'
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
    for (var i = 0; i < trackers.length; i++) {
        var tracker = trackers[i];
        var expression = globber(tracker.mask);
        if (expression.test(urlObject.href)) {
            return tracker.name;
        }
    }
    return 'Unknown';
}

var trackerMasks = [];
for (var i = 0; i < trackers.length; i++) {
    trackerMasks.push(trackers[i].mask);
}
chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            chrome.tabs.get(parseInt(details.tabId), function(tab) {
                
                var urlObject = urlParser.parse(details.url, true);
                
                notifyAnalyticsEvent({
                    timestamp: details.timeStamp,
                    url: urlObject,
                    origin: tab.url,
                    requestBody: details.requestBody,
                    tracker: findTracker(urlObject)
                });
            });
        },
        { urls: trackerMasks },
        ['requestBody']);