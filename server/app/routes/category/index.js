'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model("Category");
var ListItem = mongoose.model("ListItem");
var Product = mongoose.model('Product');
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird'); //TODO refactor the routes to be promises instead of callbacks

// var Category = Promise.promisifyAll(Category);
// var ListItem = Promise.promisifyAll(ListItem);


var ensureAdmin = function (req, res, next) {
    if (req.isAdmin()) {
        //TODO write isAdmin function
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', function (req, res, next) {
    //find all categories
    Category.find({}, function (err, categoryObjArr) {
        if (err) return next(err);
        //console.log("category Object: ", categoryObjArr);
        //send array of all categories back
        res.send(categoryObjArr);
    });

});
router.get('/:cat_id', function (req, res) {

    ListItem.find({category: req.params.cat_id}, function (err, listItemArr) {
        //return array of list items of the specified cat
        //console.log("server side listItem: ", listItemArr)
        res.send(listItemArr);

    });

});

router.post('/', ensureAdmin, function (req, res) {

});
router.put('/', ensureAdmin, function (req, res) {

});
router.delete('/', ensureAdmin, function (req, res) {

});
