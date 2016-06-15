const urlParser = require('url');

var currentTabUrl;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentTabUrl = urlParser.parse(tabs[0].url, true);
    document.querySelector('#current-domain').innerText = currentTabUrl.hostname;
    chrome.storage.local.get('domains', function(result) {
        var domains = result['domains'];
        if (Array.isArray(domains) && domains.indexOf(currentTabUrl.hostname) !== -1) {
            document.querySelector('input').checked = true;
        }
    });
});

document.querySelector('input').onclick = toggleStylesheet;

function toggleStylesheet(event) {
    var input = event.target;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { analyticsTagging: input.checked });
        
        chrome.storage.local.get('domains', function(result) {
           var domains = result['domains'];
           if (!Array.isArray(domains)) {
               domains = [];
           }
           if (input.checked) {
               domains.push(currentTabUrl.hostname);
           } else {
               var index = domains.indexOf(currentTabUrl.hostname);
               if (index > -1) {
                   domains.splice(index, 1);
               }
           }
           chrome.storage.local.set({'domains': domains });
        });
    });
}
