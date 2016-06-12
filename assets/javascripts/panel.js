var port = chrome.runtime.connect({name: 'analytics'});

port.onMessage.addListener(function(message) {
    console.log(message);
    
    try {
        var event = createEvent(message);
        console.log(event);
        appendEventToTable(event);
    } catch (err) {
        console.log(err);
    }  
});

function createEvent(message) {
    switch (message.tracker) {
        case ('Anametrix'):
        case ('YP Analytics'):
            return new AnalyticsEventPixelTracker(message);
        case ('Amplitude'):
            return new AnalyticsEventAmplitude(message);
        default:
            return new AnalyticsEvent(message);
    }
}

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
        var searchSession = parseSearchSession(value);
        table.appendChild(createSearchIdRow('raw value', value));
        if (searchSession.valid) {
            table.appendChild(createSearchIdRow('session id', searchSession.searchId));
            table.appendChild(createSearchIdRow('what', searchSession.what));
            table.appendChild(createSearchIdRow('where', searchSession.where));
            table.appendChild(createSearchIdRow('number of results', searchSession.numResults));            
        }
        return table;
    } else {
        return document.createTextNode(value);    
    }   
}

function parseSearchSession(searchSession) {
    searchSession = searchSession || '';
    var searchSessionTokens = searchSession.split('_');
    if (searchSessionTokens.length === 4) {
        return {
            valid: true,
            searchId: searchSessionTokens[0],
            what: decode(searchSessionTokens[1]),
            where: decode(searchSessionTokens[2]),
            numResults: searchSessionTokens[3]
        };
    }
    return {
        valid: false
    };
}

/**
 * If the base 64 decoding fails, return the non-decoded value anyway
 */
function decode(value) {
    try {
        return atob(value);
    } catch (err) {
        return value;
    }
}

function createSearchIdRow(label, value) {
    var row = document.createElement('tr');
    row.appendChild(document.createElement('td')).appendChild(document.createTextNode(label));
    row.appendChild(document.createElement('td')).appendChild(document.createTextNode(value));
    return row;
}

function appendEventToTable(event) {
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
}

function clickHandler(row) {
    return function() {
        var data = row.querySelector('.data-cell').innerHTML;
        
        var selectedRows = document.querySelectorAll('tr.selected');
        for (var i = 0; i < selectedRows.length; ++i) {
            selectedRows[i].className = '';
        }
        
        row.className = 'selected';
        createEventPanel(JSON.parse(data));
    }
}

function init() {
    document.querySelector('#clear-events').addEventListener('click', clearHandler);
}

function clearHandler() {
    document.querySelector('#events tbody').innerHTML = '';
    document.querySelector('#event-details').innerHTML = '';
}

init();