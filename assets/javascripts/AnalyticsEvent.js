const moment = require('moment');

class AnalyticsEvent {
    
    constructor(analyticsEvent) {
        this.analyticsEvent = analyticsEvent;
    }
    
    getTimestamp() {
        return moment(this.analyticsEvent.timestamp).format("YYYY-MM-DDTHH:mm:ss");
    }
    
    getOrigin() {
        return this.analyticsEvent.origin;
    }
    
    getData() {
        return {};
    }
    
    getType() {
        return 'Other';
    }
    
    getTracker() {
        return this.analyticsEvent.tracker;
    }
    
    getBinding() {
        return 'Unknown';
    }
}

module.exports = AnalyticsEvent;