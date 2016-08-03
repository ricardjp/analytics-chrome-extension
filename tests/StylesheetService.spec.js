const chai = require('chai');
require('jsdom-global')();
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

var StylesheetService = require('../assets/javascripts/service/StylesheetService');
var urlParser = require('url');

describe('StylesheetService', function() {
    
    var service;
    
    before(function() {
        global.chrome = require('sinon-chrome');
        chrome.extension.getURL.withArgs('path/to/my/stylesheet.css').returns('chrome/translated/url.css');
    });
    
    beforeEach(function() {
        service = new StylesheetService();
        global.document.head.innerHTML = '';
    });
    
    it('loadStylesheet() should add the stylesheet to the dom', function() {
        expect(document.getElementsByTagName('link')).to.have.length(0);
        service.loadStylesheet({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        });
        expect(document.getElementsByTagName('link')).to.have.length(1);
        var injectedStylesheet = document.getElementById('stylesheet-id');
        expect(injectedStylesheet.nodeName).to.equal('LINK');
        expect(injectedStylesheet.id).to.equal('stylesheet-id');
        expect(injectedStylesheet.href).to.equal('chrome/translated/url.css');
        expect(injectedStylesheet.type).to.equal('text/css');
        expect(injectedStylesheet.rel).to.equal('stylesheet');
    });
    
    it('loadStylesheet() should not add the stylesheet if it was previously added to the dom', function() {
        expect(document.getElementsByTagName('link')).to.have.length(0);
        
        service.loadStylesheet({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        });
        
        service.loadStylesheet({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        });
        
        expect(document.getElementsByTagName('link')).to.have.length(1);
    });
    
    it('unloadStylesheet() should remove the stylesheet with the specified id from the dom', function() {
        expect(document.getElementsByTagName('link')).to.have.length(0);
        service.loadStylesheet({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        });
        expect(document.getElementsByTagName('link')).to.have.length(1);
        
        service.unloadStylesheet({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        });
        
        expect(document.getElementsByTagName('link')).to.have.length(0);
    });
    
    it('toggle() should load the specified stylesheet if no value is provided', function() {
        expect(document.getElementsByTagName('link')).to.have.length(0);
        
        service.toggle({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        });
        
        expect(document.getElementsByTagName('link')).to.have.length(1);
    });
    
    it('toggle() should load the specified stylesheet if the value is true', function() {
        expect(document.getElementsByTagName('link')).to.have.length(0);
        
        service.toggle({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        }, true);
        
        expect(document.getElementsByTagName('link')).to.have.length(1);
    });
    
    it('toggle() should unload the specified stylesheet if the value is false', function() {
        expect(document.getElementsByTagName('link')).to.have.length(0);
        service.loadStylesheet({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        });
        expect(document.getElementsByTagName('link')).to.have.length(1);
        
        service.toggle({
            id: 'stylesheet-id',
            url: 'path/to/my/stylesheet.css'
        }, false);
        
        expect(document.getElementsByTagName('link')).to.have.length(0);
    });
    
});