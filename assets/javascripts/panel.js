var port = chrome.runtime.connect({name: 'analytics'});

port.onMessage.addListener(function(message) {
    var event = new AnalyticsEvent(message, new UrlParser(message.url).parseUrl());
    
    // Amplitude is not using a pixel tracker, not supported for now
    if (event.getTracker() !== 'Amplitude') {
        appendEventToTable(event);    
    }    
});

function createEventPanel(data) {
    var table = document.createElement('table');
    
    for (var property in data) {
        var row = document.createElement('tr');
        row.appendChild(document.createElement('th')).appendChild(document.createTextNode(property));
        row.appendChild(document.createElement('td')).appendChild(createValueCell(property, data[property]));

        table.appendChild(row);
    }
    
    var wrapper = document.querySelector('#event-details');
    while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
    }
    
    wrapper.appendChild(table);
}

function createValueCell(key, value) {
    if (key === 'pv.is.id') {
        var table = document.createElement('table');
        var tokens = value.split('_');
        table.appendChild(createSearchIdRow('raw value', value));
        table.appendChild(createSearchIdRow('session id', tokens[0]));
        table.appendChild(createSearchIdRow('what', atob(tokens[1])));
        table.appendChild(createSearchIdRow('where', atob(tokens[2])));
        table.appendChild(createSearchIdRow('number of results', tokens[3]));
        return table;
    } else {
        return document.createTextNode(value);    
    }   
}

function createSearchIdRow(label, value) {
    var row = document.createElement('tr');
    row.appendChild(document.createElement('td')).appendChild(document.createTextNode(label));
    row.appendChild(document.createElement('td')).appendChild(document.createTextNode(value));
    return row;
}

function appendEventToTable(event) {
    try {
        var row = document.createElement('tr');
        row.appendChild(document.createElement('td')).appendChild(document.createTextNode(event.getTimestamp()));
        row.appendChild(document.createElement('td')).appendChild(document.createTextNode(event.getType()));
        row.appendChild(document.createElement('td')).appendChild(document.createTextNode(event.getBinding()));
        row.appendChild(document.createElement('td')).appendChild(document.createTextNode(event.getTracker()));
        row.appendChild(document.createElement('td')).appendChild(document.createTextNode(event.getOrigin()));
        var data = document.createElement('td');
        data.className = 'data-cell';
        row.appendChild(data).appendChild(document.createTextNode(JSON.stringify(event.getData())));

        document.querySelector('tbody').appendChild(row);
        
        row.addEventListener('click', clickHandler(row));
    } catch (err) {
        console.log(err);
    }
}

function clickHandler(row) {
    return function() {
        var data = row.querySelector('.data-cell').innerHTML;
        createEventPanel(JSON.parse(data));
    }
}