// product-test.js

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db/models/product');
require('../../../server/db/models/category');

var Product = mongoose.model('Product');
var Category = mongoose.model('Category');

describe('Product model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Product).to.be.a('function');
    });

    it('should have name', function() {
        expect(Product.name).to.be.a('string');
    });

    xit('should have a categoryID associated', function() {
    	expect(Product.categoryID).to.exist;
    });

});