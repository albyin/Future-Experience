'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Order =  Promise.promisifyAll(mongoose.model("Order"));
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

// retrieve all or specific to an id using ?user_id=
router.get('/', function (req, res, next) {
    var filterOption = req.query;
    Order
    .searchOrder(filterOption, function(err, orders) {
        if (err) return next(err);

        res.json(orders);
    });
});

router.delete('/', function(req, res, next) {
    var deleteOrderId = req.query.order_id;
    if (!deleteOrderId) return next(new Error("No Order ID Specified"));

    Order.findByIdAndRemove(deleteOrderId)
        .then(function(deletedOrder) {
           res.send(deletedOrder);
        })
        .catch(function(err) {
            next(err);
        });
});

router.put('/', function(req, res, next){
    var queryId = req.query.user_id;
    if(!queryId) return next(new Error("Please specify an Id"));

    Order
        .findByIdAndUpdateAsync(queryId, req.body)
        .then(function(updatedOrder){
            res.send(updatedOrder);
        }).catch(function(err){
            next(err);
        });
});


