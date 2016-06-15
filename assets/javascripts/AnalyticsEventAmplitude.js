const AnalyticsEvent = require('./AnalyticsEvent');

class AnalyticsEventAmplitude extends AnalyticsEvent {
    
    constructor(analyticsEvent) {
        super(analyticsEvent);
        
        var self = this;
        this.readEventFormData = function() {
            if (self.analyticsEvent.hasOwnProperty('requestBody')
                && self.analyticsEvent.requestBody.hasOwnProperty('formData')
                && self.analyticsEvent.requestBody.formData.hasOwnProperty('e')
                && self.analyticsEvent.requestBody.formData.e) {
                    
                    var jsonEventData = JSON.parse(self.analyticsEvent.requestBody.formData.e);
                    if (jsonEventData.length > 0) {
                        return jsonEventData[0];
                    }
            }
            return {};
        }
    }
    
    getBinding() {
        var eventData = this.readEventFormData();
        if (eventData.hasOwnProperty('event_properties')) {
            var eventProperties = eventData['event_properties'];
            if (eventProperties.hasOwnProperty('lk_name')) {
                return eventProperties['lk_name'];
            } else if (eventProperties.hasOwnProperty('pg_name')) {
                return eventProperties['pg_name'];
            }    
        }
        return super.getBinding();
    }
    
    getData() {
        var eventData = this.readEventFormData();
        if (eventData.hasOwnProperty('event_properties')) {
            return eventData['event_properties'];
        }
        return super.getData();
    }
    
    getType() {
        var eventData = this.readEventFormData();
        if (eventData.hasOwnProperty('event_type')) {
            return eventData['event_type'];
        }
        return super.getType();
    }
    
}

module.exports = AnalyticsEventAmplitude;