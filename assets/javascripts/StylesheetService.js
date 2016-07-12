class StylesheetService {
    
    toggle(stylesheet, value) {
        var value = value !== false;
        if (value) {
            this.loadStylesheet(stylesheet);
        } else {
            this.unloadStylesheet(stylesheet);
        }
    }
    
    loadStylesheet(stylesheet) {
        if (document.getElementById(stylesheet.id) === null) {
            var link = document.createElement("link");
            link.href = chrome.extension.getURL(stylesheet.url);
            link.id = stylesheet.id;
            link.type = "text/css";
            link.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(link);    
        }
    }

    unloadStylesheet(stylesheet) {
        var cssNode = document.getElementById(stylesheet.id);
        cssNode && cssNode.parentNode.removeChild(cssNode);
    }
    
}

module.exports = StylesheetService;