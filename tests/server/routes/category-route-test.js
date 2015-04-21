// category-route-test.js

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var http = require("http");
var app = require("../../../server/app");
var request = require("supertest");
var assert = require("chai").assert;

require('../../../server/db/models/category');
require('../../../server/db/models/listitem');
require('../../../server/db/models/product');
require('../../../server/app/routes/category');

var Category = Promise.promisifyAll(mongoose.model('Category'));
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Product = Promise.promisifyAll(mongoose.model('Product'));

describe('Category route', function () {
    var testCategory;
    var testProduct;
    var testListItem;

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create a category', function(done) {
        Category.createAsync({
            name : "space"
        }).then(function(mongoCategoryObj) {
            testCategory = mongoCategoryObj;
            done();
        }).catch(function(err) {
            done(err);
        });
    });

    beforeEach("Create a Product", function (done){
        Product.createAsync({
            name : "Space Toilet Paper",
            category: testCategory._id
        }).then(function(mongoProductObj) {
            testProduct = mongoProductObj;
            done();
        }).catch(function(err) {
            done(err);
        });
    });

    beforeEach("Create a List Item", function (done){
        ListItem.createAsync({
            quantity : 5,
            price: 800, //we are storing this in cents
            productID : testProduct._id
        }).then(function(mongoLIObj) {
            testListItem = mongoLIObj;
            done();
        }).catch(function(err) {
            done(err);
        });
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });


    it('should return list of categories for plain get', function () {
        request(app)
            .get("/api/category")
            .end( function (err, data) {
                // console.log("CALLBACK DATA res,", data.body);
                assert.equal(data.body[0].name, testCategory.name);
            });
    });


    it('should return list item array if given category name', function () {
        request(app)
            .get("/api/category/" + testCategory.name)
            .end( function (err, data){
                console.log("CAT List Item Arr, ", data.body);
                assert.equal(data.body[0].quantity, testListItem.quantity);
            });
    });

    xit('should return only list items of correct category', function() {
        expect(testCategory.name).to.equal('Penta Kill');
    });

});