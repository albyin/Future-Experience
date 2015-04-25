'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model("Category");
var ListItem = mongoose.model("ListItem");
var Product = mongoose.model('Product');
module.exports = router;
var _ = require('lodash');
//TODO -- optional -- refactor the routes to be promises instead of callbacksg
var Promise = require('bluebird');

//TODO
var ensureAdmin = function (req, res, next) {
    if (req.isAdmin()) {
        //TODO write isAdmin function
        next();
    } else {
        res.status(401).end();
    }
};

//Get all categories
router.get('/', function (req, res, next) {
    //find all categories
    Category.find({}, function (err, categoryObjArr) {
        if (err) return next(err);
        //send array of all categories back
        res.send(categoryObjArr);
    });

});

//Get a single category
router.get('/:id', function (req, res, next) {

    Category.findOne({_id: req.params.id}, function (err, categoryObject) {
        if (err) return next(err);
        console.log("categoryObject: ", categoryObject);
        res.send(categoryObject);
    });

});

//Create new category
router.post('/', function (req, res, next) {

    Category.create({name: req.body.name}, function (err, category){
        if (err) return next(err);
        res.send(category);
    });

});

//Update a category
router.put('/:id', function (req, res, next) {

    Category.findOneAndUpdate({_id: req.params.id}, req.body, function (err, updatedObj){
        if(err) return next(err);
        res.send(updatedObj);
    });

});

//Delete a category
router.delete('/:id', function (req, res, next) {
    Category.remove({_id: req.params.id}, function (err, numRemoved){
        if (err) return next(err);
        res.sendStatus(200);
    });
});
