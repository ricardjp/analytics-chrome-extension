(function() {

    const urlParser = require('url');
    const StylesheetService = require('./service/StylesheetService');
    const stylesheetService = new StylesheetService();
    
    const stylesheet = {
        id: 'yp-analytics-tagging',
        url: 'assets/stylesheets/tagging.css'
    };

    var url = urlParser.parse(document.location.href, true);
    chrome.storage.local.get('domains', function(result) {
        if (result['domains'].indexOf(url.hostname) !== -1) {
            stylesheetService.toggle(stylesheet);
        }
    });

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            stylesheetService.toggle(stylesheet, request.analyticsTagging);
        });
    
})();