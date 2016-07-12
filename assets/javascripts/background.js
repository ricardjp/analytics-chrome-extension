const urlParser = require('url');
const globber = require('glob-to-regexp');
const TaggingService = require('./TaggingService');

const taggingService = new TaggingService();

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
    if (port.name === 'analytics' || port.name == 'pageView') {
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
        if (port.name == 'analytics') {
            port.postMessage(analyticsEvent);    
        }
    });
}

function notifyPageViewEvent(tabId) {
    ports.forEach(function(port) {
        if (port.name == 'pageView') {
            port.postMessage({ tabId: tabId });    
        }
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
                    tabId: tab.id,
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
       
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.url) {
            updateIcon(tab);
            updateStylesheet(tab);
        }
    })
});
       
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    updateIcon(tab);
    updateStylesheet(tab);
});

function updateIcon(tab) {
    var currentTabUrl = urlParser.parse(tab.url, true);
    if (taggingService.isAllowed(currentTabUrl)) {
        chrome.pageAction.show(tab.id);
        
        chrome.storage.local.get('domains', function(result) {
            chrome.pageAction.setIcon({
                path: taggingService.getIcon(result['domains'], currentTabUrl),
                tabId: tab.id
            });
        });
    }    
}

function updateStylesheet(tab) {
    var currentTabUrl = urlParser.parse(tab.url, true);
    chrome.storage.local.get('domains', function(result) {
        chrome.tabs.sendMessage(tab.id, {
            analyticsTagging: taggingService.isTaggingEnabled(result['domains'], currentTabUrl)
        });
    });
}

chrome.pageAction.onClicked.addListener(function(tab) {    
    chrome.storage.local.get('domains', function(result) {
        var currentTabUrl = urlParser.parse(tab.url, true);
        var domains = taggingService.updateList(result['domains'], currentTabUrl);

        chrome.storage.local.set({'domains': domains });
        
        // update the icon
        updateIcon(tab);
        taggingService.updateStylesheet(tab);
    });
});

chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
    notifyPageViewEvent(details.tabId);
});
