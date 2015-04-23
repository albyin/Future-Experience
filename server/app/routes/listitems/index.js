'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model("Category");
var ListItem = mongoose.model("ListItem");
var Product = mongoose.model('Product');
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird'); //TODO refactor the routes to be promises instead of callbacks

var ensureAdmin = function (req, res, next) {
    if (req.isAdmin()) {
        //TODO write isAdmin function
        next();
    } else {
        res.status(401).end();
    }
};

// Get all items
// TODO make available to admin only
router.get('/', function (req, res, next) {
    ListItem.find({}, function (err, listItemArr) {
        if (err) next(err);
        res.send(listItemArr);
    });
});

//Get all items in a category
router.get('/category/:cat_id', function (req, res, next) {

    ListItem.find({category: req.params.cat_id}, function (err, listItemArr) {
        res.send(listItemArr);
    });
});

//Get all items created by a user
//TODO make available to admins and superusers only
router.get('/user/:user_id', function (req, res, next) {
    ListItem.find({creator: req.params.user_id}, function (err, listItemArr) {
        //return array of list items of the specified user
        res.send(listItemArr);
    });
});

//Get all items based on a product
//TODO make available to admins only
router.get('/product/:prod_id', function (req, res, next) {
    ListItem.find({product: req.params.prod_id}, function (err, listItemArr) {
        if (err) return next(err);
        //return array of list items of the specified user
        res.send(listItemArr);
    });
});

//Get single item
router.get('/item/:item_id', function (req, res, next) {
    ListItem.findOne({_id: req.params.item_id}, function (err, listItem) {
        if (err) return next(err);
        res.send(listItem);
    });
});

//Create new list item
//TODO make available to admin and superuser only
router.post('/', function (req, res, next) {
    ListItem.create(req.body, function (err, listItem){
        if (err) return next(err);
        res.send(listItem);
    });
});

//Update list item
router.put('/:id', function (req, res) {

    ListItem.findOneAndUpdate({_id: req.params.id}, req.body, function (err, updatedObj){
        if(err) return next(err);
        res.send(updatedObj);
    });

});

router.delete('/:id', function (req, res, next) {
    ListItem.remove({_id: req.params.id}, function (err){
        if (err) return next(err);
        res.sendStatus(200);
    });
});
