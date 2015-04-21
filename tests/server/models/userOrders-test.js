var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var mongoose = require('mongoose');

require('../../../server/db/models/userOrders');


var UserOrders = mongoose.model('UserOrders');


describe('UserOrders model', function () {

    var test;
    var testUseOrder;

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);

    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });
 
});