(function() {
    
    const AnalyticsIntrospector = require('./AnalyticsIntrospector');
    
    function updateLastSelected(element) {
        document.querySelector('#binding').innerHTML = element.binding ? element.binding : '<span class="info">Unknown</span>';
        
        if (element.context) {
            tableCreate('context', element.context);
        } else {
            document.querySelector('#context').innerHTML = '<span class="info">Unknown</span>';    
        }
        
        if (element.dataLayer) {
            tableCreate('dataLayer', element.dataLayer);    
        } else {
            document.querySelector('#dataLayer').innerHTML = '<span class="info">Unknown</span>';
        }   
    }

    function tableCreate(type, jsonObject) {
        var wrapper = document.querySelector('#' + type);
        var tbl = document.createElement('table');
        var tbdy = document.createElement('tbody');
        for (var property in jsonObject) {
            var tr = document.createElement('tr');
            
            var propertyTd = document.createElement('td');
            propertyTd.appendChild(document.createTextNode(property))
            
            var propertyValueTd = document.createElement('td');
            propertyValueTd.appendChild(document.createTextNode(cleanPropertyValue(jsonObject[property])));
                    
            tr.appendChild(propertyTd);
            tr.appendChild(propertyValueTd);
            tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);

        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }
        
        wrapper.appendChild(tbl)
    }
    
    function cleanPropertyValue(value) {
        return JSON.stringify(value).replace(/^"([^"]*)"$/g, '$1');
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