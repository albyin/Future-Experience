'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Order = mongoose.model("Order");
var ListItem = Promise.promisifyAll(mongoose.model("ListItem"));
module.exports = router;
var _ = require('lodash');

//var ensureAdmin = function (req, res, next) {
//    if (req.isAdmin()) {
//        //TODO write isAdmin function
//        next();
//    } else {
//        res.status(401).end();
//    }
//};

// retrieve all orders
router.get('/', function (req, res, next) {
    Order
        .find({})
        .deepPopulate('user listitems.item listitems.item.product listitems.item.category')
        .exec(function(err, orders) {
            if (err) return next(err);

            res.json(orders);
        });
});

// retrieve all or specific to an id using ?user_id=
router.get('/user/:user_id', function (req, res, next) {
    var user_id = req.params.user_id;
    if (!user_id) return next(new Error("User ID is not specified on the URL"));

    Order
    .getOrdersByUserId(user_id, function(err, orders) {
        if (err) return next(err);

        res.json(orders);
    });
});

// retrieve specific order ID
router.get('/:order_id', function (req, res, next) {
    var order_id = req.params.order_id;
    if (!order_id) return next(new Error("Order ID is not specified on the URL"));

    Order
    .getOrdersByOrderId(order_id, function(err, orders) {
        if (err) return next(err);

        res.send(orders);
    });
});

// create a new Order
router.post('/', function(req, res, next) {
    var newOrder = req.body;

    Order.create(newOrder, function(err, createdOrder) {
        if (err) return next(err);

        res.send(createdOrder);
    })
});

// change an existing Order
router.put('/:order_id', function(req, res, next) {
    var order_id = req.params.order_id;
    if (!order_id) return next(new Error("Order ID is not specified on the URL"));

    var updateOption = req.body._update || {};
    Order
    .findByIdAndUpdateOrder(order_id, updateOption, function(err, saved) {
        if (err) return next(err);

        if (saved) {
            res.sendStatus(200);
        } else {
            next(new Error("API error has occured"));
        }
    });
});

// delete an existing Order
router.delete('/:order_id', function(req, res, next) {
    var order_id = req.params.order_id;
    if (!order_id) return next(new Error("Order ID is not specified on the URL"));

    Order.remove({_id: order_id}, function (err){
        if (err) return next(err);
        res.sendStatus(200);
    });
});

