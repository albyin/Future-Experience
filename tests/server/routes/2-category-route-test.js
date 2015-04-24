// category-route-test.js

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();
chai.use(require('chai-things'));

var mongoose = require('mongoose');
var Promise = require('bluebird');
var http = require("http");
var app = require("../../../server/app");
var request = require("supertest");

require('../../../server/db/models/category');
require('../../../server/db/models/listitem');
require('../../../server/db/models/product');
require('../../../server/app/routes/category');

var Category = Promise.promisifyAll(mongoose.model('Category'));
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Product = Promise.promisifyAll(mongoose.model('Product'));

describe('Category GET, POST, PUT, DELETE routes', function () {
    var testCategory;
    var testProduct;
    var testListItem;
    var altCategory;
    var altProduct;
    var altListItem;

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create a test category, product and listitem', function (done) {

        var promises = [];
        promises.push(Category.createAsync({
            name: "space"
        }));
        promises.push(Product.createAsync({
            name: "Space Toilet Paper"
        }));

        Promise
            .all(promises)
            .then(function (array) {
                testCategory = array[0];
                testProduct = array[1];
                return ListItem.createAsync({
                    quantity: 5,
                    price   : 800,
                    product : testProduct._id,
                    category: testCategory._id
                });
            }).then(function (listitem) {
                testListItem = listitem;
                done();
            }).catch(function (err) {
                done(err);
            });
    });
    beforeEach('Create an alt category, product and listitem', function (done) {

        var altPromises = [];
        altPromises.push(Category.createAsync({
            name: "flood"
        }));
        altPromises.push(Product.createAsync({
            name: "WaterProof Toilet Paper"
        }));

        Promise
            .all(altPromises)
            .then(function (array) {
                altCategory = array[0];
                altProduct = array[1];
                return ListItem.createAsync({
                    quantity: 5,
                    price   : 800,
                    product : altProduct._id,
                    category: altCategory._id
                });
            }).then(function (listitem) {
                altListItem = listitem;
                done();
            }).catch(function (err) {
                done(err);
            });
    });

    after('Clear test database', function (done) {
        clearDB(done);
    });

    describe("GET functions: ", function () {

        it('should return list of categories for plain get', function (done) {
            request(app)
                .get("/api/category")
                .end(function (err, data) {
                    if (err) done(err);
                    assert.equal(data.body[0].name, testCategory.name);
                    done();
                });
        });
    });

    describe("POST functions: ", function () {

        //posting to category should create a new category
        var testCatName = "nuclear winter";
        var testCatObj;

        it("should create a new category", function (done) {
            request(app).post("/api/category/").send({name: testCatName})
                .end(function (err, response) {
                    if (err) return done(err);

                    expect(response.status).to.be.equal(200);

                    testCatObj = response.body; //capture the newly created cat object

                    request(app).get("/api/category/").end(function (err, response) {
                        if (err) return done(err);
                        response.res.body.should.contain.a.thing.with.property("_id", testCatObj._id);
                        done();
                    });
                });
        });

    });

    describe("PUT functions: ", function () {

        it("should be able to update categories", function (done) {

            var updatedCategoryName = {name: "Global Warming"};

            request(app).put("/api/category/" + testCategory._id).send(updatedCategoryName)
                .end(function (err, response) {
                    if (err) return done(err);

                    expect(response.status).to.equal(200);

                    request(app).get("/api/category/" + testCategory._id).end(function (err, response) {
                        if (err) return done(err);
                        response.res.body.should.have.property("name", updatedCategoryName.name);
                        done();
                    });
                });
        });
    });

    describe("DELETE functions: ", function () {

        it("should be able to delete categories", function (done) {

            request(app).del("/api/category/" + testCategory._id)
                .end(function (err, response) {
                    if (err) return done(err);

                    expect(response.status).to.equal(200);

                    request(app).get("/api/category/" + testCategory._id).end(function (err, response) {
                        if (err) return done(err);
                        expect(response.res.body).to.equal(undefined);
                        done();
                    });
                });
        });
    });

});
