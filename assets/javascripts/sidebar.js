window.onload = function() {

}

function updateLastSelected(element) {
    console.log(JSON.stringify(element));
    document.querySelector('#binding').innerHTML = element.binding ? element.binding : '<span class="info">Unknown</span>';
    document.querySelector('#context').innerHTML = element.context ? element.context : '<span class="info">Unknown</span>';
    
    if (element.dataLayer) {
        tableCreate(element.dataLayer);    
    } else {
        document.querySelector('#dataLayer').innerHTML = '<span class="info">Unknown</span>';
    }   
}


function tableCreate(jsonObject) {
    var dataLayer = document.querySelector('#dataLayer');
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for (var property in jsonObject) {
        var tr = document.createElement('tr');
        
        var propertyTd = document.createElement('td');
        propertyTd.appendChild(document.createTextNode(property))
        
        var propertyValueTd = document.createElement('td');
        propertyValueTd.appendChild(document.createTextNode(JSON.stringify(jsonObject[property])));
                
        tr.appendChild(propertyTd);
        tr.appendChild(propertyValueTd);
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);

    while (dataLayer.firstChild) {
        dataLayer.removeChild(dataLayer.firstChild);
    }
    
    dataLayer.appendChild(tbl)
}

function loadLastSelected() {
    chrome.devtools.inspectedWindow.eval("(" + AnalyticsIntrospector.toString() + ")($0)", function (result, isException) {
      if (!isException && result !== null) {
        //include tabId so that we are able to differentiate between elements from current and other tab
        //result.tabId = chrome.devtools.inspectedWindow.tabId;

        updateLastSelected(result);
      }
    });
  }
  
  function init() {
    chrome.devtools.panels.elements.onSelectionChanged.addListener(loadLastSelected);
    loadLastSelected();
  }
  
  init();


