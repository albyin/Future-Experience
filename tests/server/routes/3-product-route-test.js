// product-route-test.js

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
//Perhaps unneccessary
//require('../../../server/app/routes/category');

var Category = Promise.promisifyAll(mongoose.model('Category'));
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Product = Promise.promisifyAll(mongoose.model('Product'));

describe('Product GET, POST, PUT, DELETE routes', function () {
    var testCategory;
    var testProduct;
    var testListItem;
    var altTestCategory;
    var altTestProduct;
    var altTestListItem;

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
                //console.log("category: ", testCategory, "product: ", testProduct);
                return ListItem.createAsync({
                    quantity: 5,
                    price   : 800, //we are storing this in cents
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
                altTestCategory = array[0];
                altTestProduct = array[1];
                //console.log("category: ", testCategory, "product: ", testProduct);
                return ListItem.createAsync({
                    quantity: 5,
                    price   : 800, //we are storing this in cents
                    product : altTestProduct._id,
                    category: altTestCategory._id
                });
            }).then(function (listitem) {
                altTestListItem = listitem;
                done();
            }).catch(function (err) {
                done(err);
            });
    });

    after('Clear test database', function (done) {
        clearDB(done);
    });


    describe("GET", function () {

        it('should return collection of products', function (done) {
            request(app)
                .get("/api/product")
                .end(function (err, data) {
                    if (err) done(err);
                    assert.equal(data.body[0].name, testProduct.name);
                    done();
                });
        });


        it('should return a single product if given _id', function () {
            request(app)
                .get("/api/product/" + testProduct._id)
                //receive one item with product._id === product._id we submitted
                .end(function (err, data) {
                    data.res.body.should.have.property('_id', testProduct._id.toString());
                    //assert.equal(data.body[0].category, testCategory._id);
                });
        });

    });

    describe("POST", function () {

        //posting to product should create a new product
        var newProductName = "Coffee Brand Coffee";
        var newProductObject;

        it("should create a new product", function (done) {

            request(app).post("/api/product/").send({name: newProductName})
                .end(function (err, response) {
                    if (err) return done(err);
                    // Check to see that newly created (or already found in db)
                    // object is sent back.
                    expect(response.status).to.be.equal(200);
                    expect(response.body.name).to.be.equal(newProductName);

                    newProductObject = response.body; //capture the newly created product object
                    // Is new product in Product collection in db?
                    request(app).get("/api/product/").end(function (err, response) {
                        if (err) return done(err);
                        //console.log(response.res.body);
                        response.res.body.should.contain.a.thing.with.property("_id", newProductObject._id);
                        done();
                    });
                });
        });

    });

    // TODO finish testing for Product PUT
    // Having trouble matching one element of an array
    // Required chai-things to help with this. Gives some methods.
    // Visually confirmed WORKING!

    describe("PUT", function () {

        it("should be able to update a product", function (done) {

            var newProductDetails = "Works for your space butt! 0 G compliant!";

            request(app).put("/api/product/" + testProduct._id).send({details: newProductDetails})
                .end(function (err, response) {
                    if (err) return done(err);
                    //console.log("REsponse.body - PUT ROUTE: ", response.body);
                    expect(response.status).to.equal(200);

                    request(app).get("/api/product/" + testProduct._id).end(function (err, response) {
                        if (err) return done(err);
                        //console.log("RESPONSE RES BODY -- Get ONE route,", response.res.body);
                        //expect(response.res.body._id).to.equal(testProduct)
                        //    .should.contain
                        //    .a.thing.to.include
                        //    .all.keys({"_id": testCategory._id, "name": newCatName});

                        done();
                    });

                });
        });
    });

    describe("DELETE", function () {

        it("should delete a product", function (done) {

            request(app).del("/api/product/" + testProduct._id)
                .end(function (err, response) {
                    if (err) return done(err);

                    expect(response.status).to.equal(200);

                    request(app).get("/api/product/" + testProduct._id).end(function (err, response) {
                        if (err) return done(err);
                        expect(response.res.body).to.equal(undefined);
                        done();
                    });
                });
        });
    });
});