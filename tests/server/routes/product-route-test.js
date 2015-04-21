//// category-route-test.js
//
//var dbURI = 'mongodb://localhost:27017/testingDB';
//var clearDB = require('mocha-mongoose')(dbURI);
//
//var expect = require('chai').expect;
//var assert = require("chai").assert;
//var should = require('chai').should();
////chai.use(require('chai-things'));
//
//var mongoose = require('mongoose');
//var Promise = require('bluebird');
//var http = require("http");
//var app = require("../../../server/app");
//var request = require("supertest");
//
//
//require('../../../server/db/models/category');
//require('../../../server/db/models/listitem');
//require('../../../server/db/models/product');
//require('../../../server/app/routes/category');
//
//var Category = Promise.promisifyAll(mongoose.model('Category'));
//var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
//var Product = Promise.promisifyAll(mongoose.model('Product'));
//
//describe('Product route', function () {
//    var testCategory;
//    var testProduct;
//    var testListItem;
//
//    beforeEach('Establish DB connection', function (done) {
//        if (mongoose.connection.db) return done();
//        mongoose.connect(dbURI, done);
//    });
//
//    beforeEach('Create a category, product and listitem', function(done) {
//
//        var promises = [];
//
//        promises.push( Product.createAsync({
//            name : "Space Toilet Paper"
//        }));
//
//        Promise
//            .all(promises)
//            .then( function (array) {
//                testProduct = array[0];
//                //console.log("category: ", testCategory, "product: ", testProduct);
//                return ListItem.createAsync({
//                    quantity : 5,
//                    price: 800, //we are storing this in cents
//                    product : testProduct._id,
//                    category: testCategory._id
//                });
//            }).then(function (listitem) {
//                testListItem = listitem;
//                done();
//            }).catch(function(err) {
//                done(err);
//            });
//    });
//
//    after('Clear test database', function (done) {
//        clearDB(done);
//    });
//
//
//    it('should return list of categories for plain get', function () {
//        request(app)
//            .get("/api/category")
//            .end( function (err, data) {
//                console.log("CALLBACK DATA res,", data.body);
//                assert.equal(data.body[0].name, testCategory.name);
//            });
//    });
//
//
//});