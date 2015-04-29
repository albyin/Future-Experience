'use strict';
var fs = require('fs-extra');
var path = require('path');
var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Product = mongoose.model('Product');
var _ = require('lodash');
var Promise = require('bluebird'); //TODO refactor the routes to be promises instead of callbacks

var rootPath = path.join(__dirname, '../../../../');

module.exports = router;

// TODO - check userType function
//var ensureAdmin = function (req, res, next) {
//    if (req.isAdmin()) {
//        next();
//    } else {
//        res.status(401).end();
//    }
//};

//Get all products
router.get('/', function (req, res, next) {
    //find all products of a given category
    Product.find({}, function (err, productsArr) {
        if (err) return next(err);
        //send array of all categories back
        res.send(productsArr);
    });
});

//Get one product in a category
router.get('/:id', function (req, res, next) {
    Product.findOne({_id: req.params.id}, function (err, productDoc) {
        if (err) return next(err);
        console.log("GET ONE PRODUCT return: ", productDoc);
        res.send(productDoc);
    });
});

router.post('/', function (req, res, next) {

    Product.create(req.body, function (err, product){
        if (err) return next(err);
        res.send(product);
    });

});

router.post('/upload', function (req, res, next) {

    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log("IT WORKS: ", __dirname);
        var fstream = fs.createWriteStream(rootPath + "/browser/images/uploads/" + filename);
        fstream.on('close', function () {
            res.send('images/uploads/' + filename);
        });

        file.pipe(fstream);
    });

    req.pipe(req.busboy);




});

router.put('/:id', function (req, res, next) {
    Product.findOneAndUpdate({_id: req.params.id}, req.body, function (err, updatedObj){
        console.log("HERE!!");
        if(err) return next(err);
        res.send(updatedObj);
    });

});

router.delete('/:id', function (req, res, next) {
    Product.remove({_id: req.params.id}, function (err){
        if (err) return next(err);
        res.sendStatus(200);
    });
});
