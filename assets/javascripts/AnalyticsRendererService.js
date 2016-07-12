class AnalyticsRendererService {
    
    constructor(jsonObject) {
        this.jsonObject = jsonObject;
    }
    
    renderTable(type) {       
        var wrapper = document.querySelector('#' + type);
        var tbl = document.createElement('table');
        var tbdy = document.createElement('tbody');
        for (var property in this.jsonObject) {
            tbdy.appendChild(this.createRow(property));
        }
        tbl.appendChild(tbdy);

        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }
        
        wrapper.appendChild(tbl);
    }
    
    createRow(property) {
        var row = document.createElement('tr');
                    
        row.appendChild(this.createCell('th', property));
        row.appendChild(this.createCell('td', this.cleanPropertyValue(this.jsonObject[property])));
        
        return row;
    }
    
    createCell(type, content) {
        var cell = document.createElement(type);
        cell.appendChild(document.createTextNode(content));
        return cell;
    }
    
    cleanPropertyValue(value) {
        return JSON.stringify(value).replace(/^"([^"]*)"$/g, '$1');
    }
    
}

module.exports = AnalyticsRendererService;