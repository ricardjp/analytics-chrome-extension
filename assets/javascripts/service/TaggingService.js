const globber = require('glob-to-regexp');
const urlParser = require('url');

const allowedDomains = [
    '*.yellowpages.ca',
    '*.pagesjaunes.ca',
    'localhost',
    '127.0.0.1'
];

const icons = {
    active: 'assets/images/icon-check.png',
    inactive: 'assets/images/icon-normal.png'
};

class TaggingService {
    
    isAllowed(url) {
        for (var i = 0; i < allowedDomains.length; i++) {
            var result = globber(allowedDomains[i]).test(url.hostname);
            if (result) {
                return result;
            }            
        }
        return false;
    }
    
    getIcon(domains, url) {
        if (Array.isArray(domains) && domains.indexOf(url.hostname) !== -1) {
            return icons.active;
        }
        return icons.inactive;
    }
    
    updateList(domains, url) {
        var updatedList = Array.isArray(domains) ? domains : [];
        var urlIndex = updatedList.indexOf(url.hostname);
        if (urlIndex !== -1) {
            updatedList.splice(urlIndex, 1);
        } else {
            updatedList.push(url.hostname);
        }
        return updatedList;
    }
    
    isTaggingEnabled(domains, url) {
        return Array.isArray(domains) && domains.indexOf(url.hostname) !== -1;
    }
    
    retrieveDomainsFromStorage() {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.get('domains', function(result) {
                resolve(result['domains'])
            });    
        });
    }
    
    sendTaggingMessage(tab, domains) {
        var currentTabUrl = urlParser.parse(tab.url, true);
        chrome.tabs.sendMessage(tab.id, {
            analyticsTagging: this.isTaggingEnabled(domains, currentTabUrl)
        });
    }
    
    updateStylesheet(tab) {
        var self = this;
        self.retrieveDomainsFromStorage().then(function(domains) {
            self.sendTaggingMessage(tab, domains)
        });
    }
    
    
    
}

module.exports = TaggingService;
