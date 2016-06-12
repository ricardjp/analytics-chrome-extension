class AnalyticsEventPixelTracker extends AnalyticsEvent {
    
    constructor(analyticsEvent) {
        super(analyticsEvent);
        
        var self = this;
        this.getUrl = function() {
            return self.analyticsEvent.url; 
        }
    }
    
    getData() {
        return this.getUrl().query;
    }
    
    getType() {
        if (this.getUrl().query.hasOwnProperty('g.a') && this.getUrl().query['g.a'] === 'pv') {
            return 'Page View';
        } else if (this.getUrl().query.hasOwnProperty('pv.s.n') && this.getUrl().query['pv.s.n'] === 'link') {
            return 'Click';
        } else if (this.getUrl().query.hasOwnProperty('_ev') && this.getUrl().query['_ev'] === 'link') {
            return 'Click';
        } else if (this.getUrl().query.hasOwnProperty('_ev') && this.getUrl().query['_ev'] === 'view') {
            return 'Page View';
        }
        return super.getType();
    }
    
    getBinding() {
        if (this.getUrl().query.hasOwnProperty('pv.lc.n')) {
            return this.getUrl().query['pv.lc.n'];
        } else if (this.getUrl().query.hasOwnProperty('pv.p.g.n')) {
            return this.getUrl().query['pv.p.g.n'];
        }
        return super.getBinding();
    }
    
}