// category-route-test.js

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var assert = require("chai").assert;

var mongoose = require('mongoose');
var Promise = require('bluebird');
var http = require("http");
var app = require("../../../server/app");
var request = require("supertest");


require('../../../server/db/models/user');

var User = Promise.promisifyAll(mongoose.model('User'));

describe('User route', function () {
    var testUser = {
        firstName      : "Hello",
        lastName       : "World",
        email          : "test@gmail.com",
        password       : "password",
        passwordConfirm: "password"
    };
    var createdUser;

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create a user', function (done) {
        User.createAsync({
            firstName      : "Barack",
            lastName       : "Obama",
            email          : "obama@gmail.com",
            password       : "password",
            passwordConfirm: "password"
        }).then(function (user) {
            createdUser = user;
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    after('Clear test database', function (done) {
        clearDB(done);
    });
//TODO -- fix test for POST /signup
    describe('POST /signup', function () {

        it('should sign up a new user and return him/her', function (done) {
            request(app)
                .post("api/user/signup")
                .send(testUser)
                .end(function (err, data) {
                    console.log('err: ', err);
                    console.log('data: ', data);
                    //var user = data.body.user;
                    //assert.equal(user.firstName, testUser.firstName);
                    done();
                });
        });
    });

    describe('GET /login', function () {

        it('should login an existing user and return him/her', function (done) {
            request(app)
                .get("/login")
                .send({
                    email   : createdUser.email,
                    password: createdUser.password
                })
                .end(function (err, data) {
                    assert.equal(data.statusCode, 200);
                    done();
                });
        });
    });

    describe('PUT', function () {

        it('should update specific user', function (done) {
            request(app)
                .put("/api/user/" + createdUser.id)
                .send({
                    firstName: "Blah"
                })
                .end(function (err, data) {
                    var user = data.body;
                    assert.notEqual(user.firstName, createdUser.firstName);
                    assert.equal(user.firstName, "Blah");
                    done();
                });
        });
    });

    describe('GET', function () {
        it('should get specific user', function (done) {
            request(app)
                .get("/api/user/" + createdUser.id)
                .end(function (err, data) {
                    var user = data.body;
                    assert.equal(user.firstName, createdUser.firstName);
                    done();
                });
        });

        it('should get all users', function (done) {
            request(app)
                .get("/api/user/")
                .end(function (err, data) {
                    var user = data.body;
                    assert.equal(user[0].firstName, createdUser.firstName);
                    done();
                });
        });
    });

    describe('DELETE', function () {
        it('should delete specific user', function (done) {
            request(app)
                .delete("/api/user/" + createdUser.id)
                .end(function (err, data) {
                    var user = data.body;
                    assert.equal(user.firstName, createdUser.firstName);
                    done();
                });
        });
    });

});
