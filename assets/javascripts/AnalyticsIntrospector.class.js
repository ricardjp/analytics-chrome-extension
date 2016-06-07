function AnalyticsIntrospector(node) {
    "use strict";
    
    function retrieveAttribute(attributeName) {
        var analyticsNode = node.closest('[' + attributeName + ']');
        if (analyticsNode) {
            return analyticsNode.attributes[attributeName] ? JSON.parse(analyticsNode.attributes[attributeName].value) : undefined;            
        }
    }
    
    function init() {
        return {
            binding: retrieveAttribute('data-analytics-binding'),
            context: retrieveAttribute('data-analytics-context'),
            dataLayer: retrieveAttribute('data-analytics')
        };
    }
    
    return init();
}