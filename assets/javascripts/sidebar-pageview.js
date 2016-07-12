(function() {

    const AnalyticsRendererService = require('./AnalyticsRendererService');
    
    var port = chrome.runtime.connect({ name: 'pageView' });
    port.onMessage.addListener(function(message) {
        if (message.tabId === chrome.devtools.inspectedWindow.tabId) {
            updatePageView();   
        }  
    });
    
    function updatePageView() {
        chrome.devtools.inspectedWindow.eval("tc_vars", function(result, isException) {
            
            // only show something if tc_vars is accessible and is evaluated successfully
            if (!isException) {
                new AnalyticsRendererService(result).renderTable('page');
            }
        });
    }
    
    // make sure we refresh the page view when first opening the sidebar
    updatePageView();
    
})();