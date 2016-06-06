function AnalyticsIntrospector(node) {
    "use strict";
    
    function findAnalyticsBinding() {
        return node.attributes['data-analytics-identifier'] ? node.attributes['data-analytics-identifier'].value : undefined;
    }
    
    function findAnalyticsContext() {
        return node.attributes['data-analytics-context'] ? JSON.parse(node.attributes['data-analytics-context'].value) : undefined;
    }
    
    function findAnalyticsDataLayer() {
        return node.attributes['data-analytics'] ? JSON.parse(node.attributes['data-analytics'].value) : undefined;
    }
    
    function init() {
        return {
            binding: findAnalyticsBinding(),
            context: findAnalyticsContext(),
            dataLayer: findAnalyticsDataLayer()
        };
    }
    
    return init();
    
}