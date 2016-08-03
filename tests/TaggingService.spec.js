const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

var TaggingService = require('../assets/javascripts/service/TaggingService');
var urlParser = require('url');

describe('TaggingService', function() {

    var service;

    before(function() {
        global.chrome = require('sinon-chrome');
    });

    beforeEach(function() {
        service = new TaggingService();
    });

    it('isAllowed() should return true when the domain is the English production domain', function() { 
        expect(service.isAllowed(urlParser.parse('http://www.yellowpages.ca/'))).to.be.true;
    });

    it('isAllowed() should return true when the domain is the French production domain', function() {
        expect(service.isAllowed(urlParser.parse('http://www.pagesjaunes.ca/'))).to.be.true;
    });

    it ('isAllowed() should return true when the domain is matching the English base domain', function() {
        expect(service.isAllowed(urlParser.parse('https://myqa.local.yellowpages.ca/my/path'))).to.be.true;
    });

    it('isAllowed() should return true when the domain is matching the French base domain', function() {
        expect(service.isAllowed(urlParser.parse('https://monqa.local.pagesjaunes.ca/mon/chemin'))).to.be.true;
    });

    it('isAllowed() should return true when the domain is localhost', function() {
        expect(service.isAllowed(urlParser.parse('http://localhost:8080/'))).to.be.true;
        expect(service.isAllowed(urlParser.parse('http://127.0.0.1:8080/'))).to.be.true;
    });

    it ('isAllowed() should return false when the domain is not in the supported list', function() {
        expect(service.isAllowed(urlParser.parse('http://www.google.ca/'))).to.be.false;
    });

    it ('getIcon() should return the normal icon when domains is not an array', function() {
        expect(service.getIcon('notAnArray', urlParser.parse('http://www.yellowpages.ca/'))).to.equal('assets/images/icon-normal.png');
    });

    it ('getIcon() should return the normal icon when domains is empty', function() {
        expect(service.getIcon([], urlParser.parse('http://www.yellowpages.ca/'))).to.equal('assets/images/icon-normal.png');
    });

    it ('getIcon() should return the normal icon when domains does not match the url', function() {
        expect(service.getIcon(['www.pagesjaunes.ca'], urlParser.parse('http://www.yellowpages.ca/'))).to.equal('assets/images/icon-normal.png');
    });

    it('getIcon() should return the active icon when domains does match the url', function() {
        expect(service.getIcon(['www.yellowpages.ca'], urlParser.parse('http://www.yellowpages.ca/'))).to.equal('assets/images/icon-check.png');
    });

    it('updateList() should return an array containing the url hostname when domains is not an array', function() {
        var updatedList = service.updateList('notAnArray', urlParser.parse('http://www.yellowpages.ca/'));
        expect(updatedList).to.be.an('array');
        expect(updatedList).to.have.length(1);
        expect(updatedList).to.contain('www.yellowpages.ca');
    });

    it('updateList() should return an array containing the url hostname when domains is empty', function() {
        var updatedList = service.updateList([], urlParser.parse('http://www.yellowpages.ca/'));
        expect(updatedList).to.be.an('array');
        expect(updatedList).to.have.length(1);
        expect(updatedList).to.contain('www.yellowpages.ca');
    });

    it('updateList() should return an array with the added url hostname when domain is not in the list', function() {
        var updatedList = service.updateList(['www.yellowpages.ca'], urlParser.parse('http://www.pagesjaunes.ca/'));
        expect(updatedList).to.be.an('array');
        expect(updatedList).to.have.length(2);
        expect(updatedList).to.contain('www.yellowpages.ca', 'www.pagesjaunes.ca');
    });

    it ('updateList() should return an array not containing the url hostname when domains contains the domain', function() {
        var updatedList = service.updateList(['www.yellowpages.ca', 'www.pagesjaunes.ca'], urlParser.parse('http://www.yellowpages.ca/'));
        expect(updatedList).to.be.an('array');
        expect(updatedList).to.have.length(1);
        expect(updatedList).to.contain('www.pagesjaunes.ca');
    });

    it('isTaggingEnabled() should return false if domains is not array', function() {
        expect(service.isTaggingEnabled('notAnArray', urlParser.parse('http://www.yellowpages.ca/'))).to.be.false;
    });

    it('isTaggingEnabled() should return false if domains do not contain url hostname', function() {
        expect(service.isTaggingEnabled([], urlParser.parse('http://www.yellowpages.ca/'))).to.be.false;
    });

    it('isTaggingEnabled() should return true if domains contain url hostname', function() {
        expect(service.isTaggingEnabled(['www.yellowpages.ca'], urlParser.parse('http://www.yellowpages.ca/'))).to.be.true;
    });

});