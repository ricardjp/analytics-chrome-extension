var AnalyticsEvent = (function() {
    
    function AnalyticsEvent(analyticsEvent, url) {
        this.analyticsEvent = analyticsEvent;
        this.url = url;
    }
    
    AnalyticsEvent.prototype.getTimestamp = function() {
        return moment(this.analyticsEvent.timestamp).format("YYYY-MM-DDTHH:mm:ss");
    }
    
    AnalyticsEvent.prototype.getOrigin = function() {
        return this.analyticsEvent.origin;
    }
    
    AnalyticsEvent.prototype.getData = function() {
        return this.url.query;
    }
    
    AnalyticsEvent.prototype.getType = function() {
        if (this.url.query.hasOwnProperty('g.a') && this.url.query['g.a'] === 'pv') {
            return 'page-view';
        } else if (this.url.query.hasOwnProperty('pv.s.n') && this.url.query['pv.s.n'] === 'link') {
            return 'click';
        } else if (this.url.query.hasOwnProperty('_ev') && this.url.query['_ev'] === 'link') {
            return 'click';
        } else if (this.url.query.hasOwnProperty('_ev') && this.url.query['_ev'] === 'view') {
            return 'page-view';
        } else {
            return 'other';
        }
    }
    
    AnalyticsEvent.prototype.getTracker = function() {
        if (this.url.hostname.match(/\.anametrix\.com$/)) {
            return 'Anametrix';
        } else if (this.url.hostname.match(/^ypghits\.yellowpages\.ca$/)) {
            return 'YP Analytics';
        } else if (this.url.hostname.match(/^api\.amplitude\.com$/)) {
            return 'Amplitude';
        } else {
            return 'Unknown';
        }
    }
    
    AnalyticsEvent.prototype.getBinding = function() {
        if (this.url.query.hasOwnProperty('pv.lc.n')) {
            return this.url.query['pv.lc.n'];
        } else if (this.url.query.hasOwnProperty('pv.p.g.n')) {
            return this.url.query['pv.p.g.n'];
        } else {
            return 'unknown';
        }
    }
    
    return AnalyticsEvent;
    
})();