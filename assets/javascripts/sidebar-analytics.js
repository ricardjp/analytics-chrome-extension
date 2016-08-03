(function() {
    
    const AnalyticsIntrospector = require('./introspection/AnalyticsIntrospector');
    const AnalyticsRendererService = require('./service/AnalyticsRendererService');
    const unknownMarkup = '<span class="info">Unknown</span>';
    
    function updateLastSelected(element) {
        document.querySelector('#binding').innerHTML = element.binding ? element.binding : unknownMarkup;
        
        if (element.context) {
            new AnalyticsRendererService(element.context).renderTable('context');
        } else {
            document.querySelector('#context').innerHTML = unknownMarkup;
        }
        
        if (element.dataLayer) {
            new AnalyticsRendererService(element.dataLayer).renderTable('dataLayer');    
        } else {
            document.querySelector('#dataLayer').innerHTML = unknownMarkup;
        }   
    }
    
    function loadLastSelected() {
        chrome.devtools.inspectedWindow.eval("(" + AnalyticsIntrospector.toString() + ")($0)", function (result, isException) {
            if (!isException && result !== null) {
                updateLastSelected(result);
            }
        });
    }
    
    function init() {
        chrome.devtools.panels.elements.onSelectionChanged.addListener(loadLastSelected);
        loadLastSelected();
    }
    
    init();
    
})();