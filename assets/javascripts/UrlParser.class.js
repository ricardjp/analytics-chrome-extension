var UrlParser = (function() {
    
    function UrlParser(urlString) {
        this.urlString = urlString;    
    }

    UrlParser.prototype.parseUrl = function() {
        var parser = document.createElement('a');
        parser.href = this.urlString;
        
        return {
            protocol: parser.protocol,
            hostname: parser.hostname,
            port: parser.port,
            path: parser.pathname,
            hash: parser.hash,
            query: parseQueryString(parser.search)
        };
    }

    function parseQueryString(queryString) {
        var params = {};
        var queries = queryString.replace(/^\?/, '').split('&');
        queries.forEach(function(query) {
            var pair = query.split('=');
            params[decode(pair[0])] = decode(pair[1]);
        });
        return params; 
    }

    function decode(s) {
        if (s !== undefined) {
            return unescape(s.replace(/\+/g, ' '));
        }
        return '';
    }
    
    return UrlParser;
    
})();