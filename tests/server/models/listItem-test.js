var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
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

        // Product
        //     .create({name:"shovel"})
        //     .then(function (err, savedProduct){
        //         test = {
        //             productID : savedProduct._id,
        //             quantity: 3,
        //             price: 300
        //         };
        //         console.log("SAVEDPRODUCT, ", savedProduct);
        //         return ListItem.create(test);
        //     })
        //     .then(function (err, savedListItem){
        //         testListItem = savedListItem;
        //         done();
        //     }).then(function (err){
        //         console.log(err);
        //     });
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(ListItem).to.be.a('function');
    });

    xit('should quantity and price', function() {
        console.log("ListItem, ", testListItem);
        expect(testListItem.quantity).to.equal(test.quantity);
        expect(testListItem.price).to.equal(test.price);
    });

    xit('should have a productID associated', function() {
        expect(testListItem.productID).to.equal(test.productID);
    });



});