'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Order =  Promise.promisifyAll(mongoose.model("Order"));
var User = Promise.promisifyAll(mongoose.model("User"));
var UserOrders = Promise.promisifyAll(mongoose.model("UserOrders"));
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
// Make sure to get rid of the function below and all user_id once the user_id has been established in session
router.param('user_id', function(req, res, next, user_id) {
    if (!user_id) {
        next(new Error("Specify User Id"));
    } else {
        req.userID = user_id;
        next();
    }
});

// get the current user's order
router.get('/:user_id', function (req, res, next) {
    var filterOption = {
        user_id : req.userID
    };

    var order_id = req.query.order_id;
    if (order_id) {
        filterOption.order_id = order_id;
    }

    UserOrders
        .searchOrder(filterOption, function(err, orders) {
            if (err) return next(err);

            res.json(orders);
        });
});

// create current user's order
router.post('/:user_id', function(req, res, next) {
    // cartItems is coming from frontend
    var listItems = req.body.cartItems || [],
        totalPrice = 0;

    if (listItems.length > 0) {
        listItems = listItems.map(function (item) {
            totalPrice += item.price;
            return item.id;
        });
    }

    Order
    .createAsync({
        listitems : listItems,
        totalPrice : totalPrice
    })
    .then(function(order) {
        return UserOrders.create({
            user : req.userID,
            order : order.id
        }).then(function(userOrders) {
            userOrders.order = order;
            return userOrders;
        });
    })
    .then(function(userOrders) {
        res.json(userOrders);
    })
    .catch(function(err) {
        next(err);
    });
});

router.delete('/:user_id', function(req, res, next) {
    var order_id = req.query.order_id;
    if (!order_id) return next(new Error("No Order ID Specified"));

    UserOrders.findOneAndRemoveAsync({ user : req.userID, order : order_id })
        .then(function(deletedUserOrder) {
            return Order
            .findByIdAndRemoveAsync(deletedUserOrder.order.toString())
            .then(function(deletedOrder) {
                res.json(deletedOrder);
            });
        })
        .catch(function(err) {
            next(err);
        });
});

router.put('/:user_id', function(req, res, next) {
    var order_id = req.query.order_id;
    if (!order_id) return next(new Error("No Order ID Specified"));

    req.body.modifiedTime = new Date();

    UserOrders.findOneAsync({ user : req.userID, order : order_id })
    .then(function(userOrder) {
        Order
            .findByIdAndUpdateAsync(userOrder.order.toString(), req.body)
            .then(function(updatedOrder) {
                res.json(updatedOrder);
            });
    })
    .catch(function(err) {
        next(err);
    });
});
