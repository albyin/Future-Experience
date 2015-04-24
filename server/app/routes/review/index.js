'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('Category');
var Product = mongoose.model('Product');
var Review = mongoose.model('Review');
var _ = require('lodash');
var Promise = require('bluebird'); //TODO refactor the routes to be promises instead of callbacks

module.exports = router;

// TODO - check userType function
//var ensureAdmin = function (req, res, next) {
//    if (req.isAdmin()) {
//        next();
//    } else {
//        res.status(401).end();
//    }
//};

//I'm an admin and I want to see all reviews.
router.get('/', function (req, res, next) {
    //find all reviews
    Review.find({}, function (err, reviewArr) {
        if (err) {
            return next(err);
        }
        //send array of all reviews back
        res.send(reviewArr);
    });
});

// I'm a user and I'd like to see all the reviews for a product
router.get('/product/:prod_id', function (req, res, next) {

    //find all reviews of a given product
    Review.find({product: req.params.prod_id}, function (err, reviewArr) {
        if (err) return next(err);
        //console.log('reviews: ', reviewArr);
        //send array of all reviews back
        res.send(reviewArr);
    });
});

// I'm a user and I want to see all the reviews I've written
router.get('/user/:userId', function (req, res, next) {
    //find all reviews of a given product
    Review.find({user: req.params.userId}, function (err, reviewArr) {
        if (err) return next(err);
        //send array of all reviews back
        res.send(reviewArr);
    });
});

//Get a single review
router.get('/:id', function (req, res, next) {
    Review.findOne({_id: req.params.id}, function (err, review) {
        if (err) return next(err);
        res.send(review);
    });
});

// I'm a user and I want to write a review for a product
router.post('/', function (req, res, next) {
    var body = req.body;
    var user = body.user;
    var product = body.product;

    Review.findOrCreate({user: user, product: product}, body, function (err, review) {
        if (err) return next(err);
        res.send(review);
    });
});

//Updated to take ID as a param
router.put('/:id', function (req, res, next) {
    Review.findOneAndUpdate({_id: req.params.id}, req.body, function (err, updatedObj) {
        if (err) return next(err);
        //console.log("updatedReview: ", updatedObj);
        res.send(updatedObj);
    });
});

router.delete('/:id', function (req, res, next) {
    Review.remove({_id: req.params.id}, function (err) {
        if (err) return next(err);
        res.sendStatus(200);
    });
});