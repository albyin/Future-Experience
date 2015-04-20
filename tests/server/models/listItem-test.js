var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db/models/user');

var ListItem = mongoose.model('ListItem');
var Product = mongoose.model('')

describe('ListItem model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(ListItem).to.be.a('function');
    });

    it('should quantity and price', function() {
        expect(ListItem.quantity.to.be.a('number'));
        expect(ListItem.price.to.be.a('number'));
    });

    xit('should have a productID associated', function() {

    });



});