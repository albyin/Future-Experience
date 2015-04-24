'use strict';

var router = require('express').Router();
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var UserModel = bluebird.promisifyAll(mongoose.model("User"));
var _ = require('lodash');
module.exports = router;

//Get All users
router.get('/', function (req, res, next) {
	UserModel.searchUser({}, function(err,foundUser){
		res.send(foundUser);
	});
});

//Get single user
router.get('/:id', function (req, res, next) {
	UserModel.searchUser(req.params.id, function(err,foundUser){
		res.send(foundUser);
	});
});

//Update a user
router.put('/:id', function(req, res, next){

	UserModel
	.findByIdAndUpdateAsync(req.params.id, req.body)
	.then(function(updatedUser){
		res.send(updatedUser);
	}).catch(function(err){
		next(err);
	});
});

//Delete a user
router.delete('/:id', function(req, res, next){

	UserModel.findByIdAndRemoveAsync(req.params.id)
	.then(function(removedUser){
		res.send(removedUser);
	}).catch(function(err){
		next(err);
	});
});
