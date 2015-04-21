'use strict';
var router = require('express').Router();
var Category = require('mongoose').model("Category");
var ListItem = require('mongoose').model("ListItem");
module.exports = router;
var _ = require('lodash');
var Promise = require('bluebird'); //TODO refactor the routes to be promises instead of callbacks

require("../../../db/models/category.js");
require("../../../db/models/listitem.js");

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

router.get('/', function (req, res) {
    //find all categories
    Category.find({}, function (err, categoryObjArr){
        //send array of all categories back
        res.send(categoryObjArr);
    });

});
router.get('/:cat', function (req, res) {

        console.log("GOT HERE, ", req.params.cat);
    //search for category based on provided category name
    Category.find({}, function (err, categoryObj){
        //given a category object, use the _id to find all list items with that cat
        console.log("GOT categories, ", categoryObj);
        // ListItem.find({category: categoryObj._id}, function (err, listItemArr){
        //     //return array of list items of the specified cat
        //     res.send(listItemArr);
        // });
    });

});

router.post('/', ensureAdmin, function (req, res) {

});
router.put('/', ensureAdmin, function (req, res) {

});
router.delete('/', ensureAdmin, function (req, res) {

});
