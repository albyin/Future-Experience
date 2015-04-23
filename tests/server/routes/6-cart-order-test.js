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
require('../../../server/db/models/order');
require('../../../server/db/models/user');
require('../../../server/db/models/userOrders');

var Category = Promise.promisifyAll(mongoose.model('Category'));
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Order = Promise.promisifyAll(mongoose.model('Order'));
var User = Promise.promisifyAll(mongoose.model('User'));
var UserOrders = Promise.promisifyAll(mongoose.model('UserOrders'));

describe('Cart and Order route', function () {
    var listItem;

    var categoryTestArr = [{name: 'Final Frontier'}, {name: 'Space'}];
    var productTestArr = [
        {name: 'Toilet paper', image: 'something.jpeg', details: 'description'},
        {name: 'Eye Liner', image: 'usefulStuff.jpeg', details: 'importantInfo'}
    ];
    var Obama =  {
        firstName : "Barack",
        lastName  : "Obama",
        email     : "obama@gmail.com",
        password  : "password",
        passwordConfirm : "password"
    },
    Justin = {
        firstName : "Justin",
        lastName  : "Bieber",
        email     : "bieber@gmail.com",
        password  : "beliebe",
        passwordConfirm : "beliebe"
    };

    var testUserOrders, testOrders;

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create 2 orders, 2 users, 2 categories, 2 products and 4 listitems', function(done) {

        var promises = [];
        promises.push(Category.createAsync(categoryTestArr));
        promises.push(Product.createAsync(productTestArr));
        promises.push(User.createAsync([Obama, Justin]));

        Promise
            .all(promises)
            .then(function(testArr){
                // console.log(testArr);
                var categoryFF = testArr[0][0];
                var categoryS = testArr[0][1];
                var productTP = testArr[1][0];
                var productEL = testArr[1][1];
                Obama = testArr[2][0];
                Justin = testArr[2][1];

                return ListItem.createAsync([
                    {quantity: 5, price: 100, product: productTP.id, category: categoryS.id},
                    {quantity: 3, price: 2000, product: productEL.id, category: categoryS.id},
                    {quantity: 8, price: 500, product: productTP.id, category: categoryFF.id},
                    {quantity: 10, price: 300, product: productEL.id, category: categoryFF.id}
                ]);
            })
            .then(function(lists) {
                listItem = lists;
                return Order.createAsync([
                    {
                        listitems: [listItem[0].id],
                        totalPrice: 500
                    },
                    {
                        listitems : [listItem[0].id],
                        totalPrice: 500
                    }
                ]);
            })
            .then(function(orders) {
                testOrders = orders;
                return UserOrders.createAsync([
                    {
                        user : Obama.id,
                        order : testOrders[0].id
                    },
                    {
                        user : Justin.id,
                        order : testOrders[1].id
                    }
                ]);
            })
            .then(function(userOrders) {
                testUserOrders = userOrders;
                done();
            }).catch(function(err){
                done(err);
            });

    });
    after('Clear test database', function (done) {
        clearDB(done);
    });

    describe('/order Route', function() {
        xit('Calling the route /order GET Should return all orders', function (done) {
            request(app)
                .get("/api/order")
                .end(function (err, data) {
                    console.log(data.res.body[0].order.listitems[0]._id);
                    assert.equal(data.res.body[0].order.listitems[0]._id, listItem[0].id);
                    done();
                });
        });

        xit('Calling the route /order GET with a specfic id should return orders that have this id', function (done) {
            request(app)
                .get("/api/order?user_id=" + Obama.id)
                .end(function (err, data) {
                    assert.equal(data.res.body[0].user._id, Obama.id);
                    done();
                });
        });

        xit('Calling the route /order PUT with a specfic id should return orders that have this id', function (done) {
            request(app)
                .put("/api/order?order_id=" + testUserOrders[0].order)
                .send({status: 2})
                .end(function (err, data) {
                    assert.equal(data.res.body.status, 2);
                    // listitems need to be populated here
                    done();
                });
        });

        xit('Calling the route /order DELETE with a specific id should return orders that have this id', function (done) {
            request(app)
                .delete("/api/order?order_id=" + testUserOrders[0].order)
                .send({status: 2})
                .end(function (err, data) {
                    assert.equal(data.res.body._id, testUserOrders[0].order);
                    done();
                });
        });
    });

    describe('/cart Route', function() {
        xit('Calling the route /cart GET Should return all orders of the user', function (done) {
            request(app)
                .get("/api/cart/" + Obama.id)
                .end(function (err, data) {
                    assert.equal(data.res.body[0].order.listitems[0]._id, listItem[0].id);
                    done();
                });
        });

        xit('Calling the route /cart GET Should return specific order of the user', function (done) {
            request(app)
                .get("/api/cart/" + Obama.id + "/?order_id=" + testOrders[0].id)
                .end(function (err, data) {
                    assert.equal(data.res.body[0].order.listitems[0]._id, listItem[0].id);
                    done();
                });
        });

        xit('Calling the route /cart POST should create and return the new order', function (done) {
            request(app)
                .post("/api/cart/" + Obama.id)
                .send(listItem)
                .end(function (err, data) {
                    assert.equal(data.res.body.user, Obama.id);
                    UserOrders
                        .findAsync({})
                        .then(function(userOrders) {
                            assert.equal(userOrders.length, 3);
                            done();
                        });
                });
        });

        xit('Calling the route /cart PUT should create and return the adjusted order', function(done) {
            request(app)
                .put("/api/cart/" + Obama.id + "?order_id=" + testUserOrders[0].order)
                .send({status: 2})
                .end(function (err, data) {
                    assert.equal(data.res.body.status, 2);
                    // listitems need to be populated here
                    done();
                });
        });

        xit('Calling the route /cart Delete should delete and return the deleted order', function(done) {
            request(app)
                .delete("/api/cart/" + Obama.id + "?order_id=" + testUserOrders[0].order)
                .end(function (err, data) {
                    //assert.equal(data.res.body.status, 2);
                    // listitems need to be populated here
                    assert.equal(data.res.body._id, testUserOrders[0].order);
                    done();
                });
        });
    });
});