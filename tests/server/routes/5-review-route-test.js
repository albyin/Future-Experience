// review-route-test.js
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
require('../../../server/db/models/review');
require('../../../server/db/models/user');

var Category = Promise.promisifyAll(mongoose.model('Category'));
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var User = Promise.promisifyAll(mongoose.model('User'));

describe('Review GET, POST, PUT, DELETE routes', function () {
    var testProduct;
    var testUser;
    var testReview;
    var altProduct;
    var altUser;
    var altReview;

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create a user and product and review', function (done) {

        var promises = [];
        promises.push(User.createAsync({
            firstName: "Buzz",
            lastName : "Lightyear",
            password : "beyond",
            email    : 'buzz@lightyear.com'
        }));
        promises.push(Product.createAsync({
            name: "Space Toilet Paper"
        }));

        Promise
            .all(promises)
            .then(function (array) {
                testUser = array[0];
                testProduct = array[1];
                return Review.createAsync({
                    stars  : 5,
                    comment: "I use it!",
                    user   : testUser._id,
                    product: testProduct._id
                });
            }).then(function (review) {
                testReview = review;
                done();
            }).catch(function (err) {
                done(err);
            });
    });
    beforeEach('Create a alt user and product and review', function (done) {

        var altPromises = [];
        altPromises.push(User.createAsync({
            firstName: "Kevin",
            lastName : "Costner",
            password : "waterworld",
            email    : 'kc@kc.com'
        }));
        altPromises.push(Product.createAsync({
            name: "WaterProof Toilet Paper"
        }));

        Promise
            .all(altPromises)
            .then(function (array) {
                altUser = array[0];
                altProduct = array[1];
                //console.log("category: ", altCategory, "product: ", altProduct);
                return Review.createAsync({
                    stars  : 3,
                    comment: "I use it. Only complaint: Stains after multiple uses",
                    user   : altUser._id,
                    product: altProduct._id
                });
            }).then(function (review) {
                altReview = review;
                done();
            }).catch(function (err) {
                done(err);
            });
    });

    after('Clear test database', function (done) {
        clearDB(done);
    });


    describe("GET functions: ", function () {

        it('should return collection of all reviews', function (done) {
            request(app)
                .get("/api/review")
                .end(function (err, data) {
                    if (err) done(err);
                    assert.equal(data.body[0].details, testReview.details);
                    done();
                });
        });

        it('should return all reviews for a single product', function () {
            request(app)
                .get("/api/review/product/" + testProduct._id)
                //receive one item with product._id === product._id we submitted
                .end(function (err, data) {
                    data.res.body.should.all.have.property('product', testProduct._id.toString());
                    //assert.equal(data.body[0].category, testCategory._id);
                });
        });

        it('should return all reviews a single user has written', function () {
            request(app)
                .get("/api/review/user/" + altUser._id)
                .end(function (err, data) {
                    console.log("DATA: ", data.res.body);
                    data.res.body.should.all.have.property('user', altUser._id.toString());
                });
        });

        it('should return a single review', function () {
            request(app)
                .get("/api/review/" + testReview._id)
                .end(function (err, data) {
                    data.res.body._id.should.equal(testReview._id.toString());
                });
        });


    });

    describe("POST functions: ", function () {


        it("should create a new review", function (done) {
            //posting to review should create a new review
            var newReview = {
                user   : testUser._id,
                product: altProduct._id,
                comment: "Do NOT use in space. Gross.",
                stars  : 0
            };
            var newReviewObject;

            request(app).post("/api/review/").send(newReview)
                .end(function (err, response) {
                    if (err) return done(err);
                    // Check to see that newly created (or already found in db)
                    // object is sent back.
                    expect(response.status).to.be.equal(200);
                    expect(response.body.comment).to.be.equal(newReview.comment);

                    newReviewObject = response.body; //capture the newly created product object
                    // Is new product in Product collection in db?
                    request(app).get("/api/review/" + newReviewObject._id).end(function (err, response) {
                        if (err) return done(err);
                        response.res.body._id.should.equal(newReviewObject._id.toString());
                        done();
                    });
                });

            //TODO optional extra test for findOrCreate static
            //    // Extra test to make user posting a second review for one product returns original review.
            //    request(app).post("/api/review/").send({user: testUser._id, product: altProduct._id, comment:
            // "Updated comment on review"}) .end(function (err, response){ if (err) return done(err); // Check to see
            // that newly created (or already found in db) // object is sent back. console.log('should be original ',
            // response.body); expect(response.status).to.be.equal(200);
            // expect(response.body._id).to.be.equal(newReviewObject._id); }); });

        });
    });

    // TODO finish testing for Review PUT
    // Visually confirmed WORKING!

    describe("PUT functions: ", function () {

        it("should be able to update a review", function (done) {

            var update = {comment: "I use it! Every day."};
            var newStars = 4;

            request(app).put("/api/review/" + testReview._id).send(update)
                .end(function (err, response) {
                    if (err) return done(err);
                    //console.log("REsponse.body - PUT ROUTE: ", response.body);
                    expect(response.status).to.equal(200);

                    //request(app).get("/api/review/" + testReview.product).end (function (err, response){
                    //    if(err) return done(err);
                    //    response.res.body.should.contain.a.thing.with.property("user", newReview.user.toString());
                    //    done();
                    //});
                    done();

                });
        });
    });

    describe("DELETE functions: ", function () {

        it("should be able to delete a review", function (done) {

            request(app).del("/api/review/" + testReview._id)
                .end(function (err, response) {
                    if (err) return done(err);

                    expect(response.status).to.equal(200);

                    request(app).get("/api/review/" + testReview._id).end(function (err, response) {
                        if (err) return done(err);
                        //console.log(response.res);
                        expect(response.res.body).to.equal(undefined);
                        done();
                    });
                });
        });
    });

});
