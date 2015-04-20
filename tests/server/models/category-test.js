// category-test.js

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

require('../../../server/db/models/category');

var Category = Promise.promisifyAll(mongoose.model('Category'));

describe('Category model', function () {
    var testCategory;

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create a category', function(done) {
        Category.createAsync({
            name : "Penta Kill"
        }).then(function(category_item) {
            testCategory = category_item;
            done();
        }).catch(function(err) {
            done(err);
        });
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Category).to.be.a('function');
    });

    it('should have name', function() {
        expect(testCategory.name).to.equal('Penta Kill');
    });
});