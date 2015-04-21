var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db/models/listitem');
require('../../../server/db/models/product');

var ListItem = mongoose.model('ListItem');
var Product = mongoose.model('Product');

describe('ListItem model', function () {

    var test;
    var testListItem;

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
});