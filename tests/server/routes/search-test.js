var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var expect = require('chai').expect;
var assert = require("chai").assert;

var mongoose = require('mongoose');
var Promise = require('bluebird');
var http = require("http");
var app = require("../../../server/app");
var request = require("supertest");


require('../../../server/db/models/category');
require('../../../server/db/models/listitem');
require('../../../server/db/models/product');

var Category = Promise.promisifyAll(mongoose.model('Category'));
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Product = Promise.promisifyAll(mongoose.model('Product'));

describe('Search route', function () {
    var listItem;
  
    var categoryTestArr = [{name: 'Final Frontier'}, {name: 'Space'}];
    var productTestArr = [
    	{name: 'Toilet paper', image: 'something.jpeg', details: 'description'},
    	{name: 'Eye Liner', image: 'usefulStuff.jpeg', details: 'importantInfo'}
    ];

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create 2 categories, 2 products and 4 listitems', function(done) {

        var promises = [];
        promises.push(Category.createAsync(categoryTestArr));
        promises.push(Product.createAsync(productTestArr));

        Promise
	        .all(promises)
	        .then(function(testArr){
	        	// console.log(testArr);
	        var categoryFF = testArr[0][0];
	        var categoryS = testArr[0][1];
	        var productTP = testArr[1][0];
	        var productEL = testArr[1][1];

	        return ListItem.createAsync([
	        	{quantity: 5, price: 100, product: productTP.id, category: categoryS.id},
	        	{quantity: 3, price: 2000, product: productEL.id, category: categoryS.id},
	        	{quantity: 8, price: 500, product: productTP.id, category: categoryFF.id},
	        	{quantity: 10, price: 300, product: productEL.id, category: categoryFF.id}
	        	]);
	        })
	        .then(function(listitem){
	        	// console.log(listitem);
	        	listItem = listitem;
	        	done();
	        }).catch(function(err){
	        	done(err);
	        });

});
    after('Clear test database', function (done) {
        clearDB(done);
    });


    it('should return all list items if nothing is specified in the search box', function (done) {
       request(app)
       .get('/api/search/')
       .end(function(err, data){
       		var allItems = data.body;
       		assert.equal(allItems.length, 4);
       		done();
       });
    });

    it('should return a list of all items matching what was specified in the search box', function(done){
    	request(app)
    	.get('/api/search/?general=Space')
    	.end(function(err, data){
    		var allItems = data.body;
    		assert.equal(allItems.length, 2);
    		console.log(allItems);
    		done();
    	});
    });

});