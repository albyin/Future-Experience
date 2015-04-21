'use strict';

var router = require('express').Router();
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var UserModel = bluebird.promisifyAll(mongoose.model("User"));
var _ = require('lodash');
module.exports = router;

router.get('/', function (req, res, next) {
	var queryId = req.query.user_id || '';
	UserModel.searchUser(queryId, function(err,foundUser){
		res.send(foundUser);
	});
});

router.put('/', function(req, res, next){
	var queryId = req.query.user_id;
	if(!queryId) return next(new Error("Please specify an Id"));

	UserModel
	.findByIdAndUpdateAsync(queryId, req.body)
	.then(function(updatedUser){
		res.send(updatedUser);
	}).catch(function(err){
		next(err);
	});
});

router.delete('/', function(req, res, next){
	var queryId = req.query.user_id;
	if(!queryId) return next(new Error("Please specify an Id"));

	UserModel.findByIdAndRemoveAsync(queryId)
	.then(function(removedUser){
		res.send(removedUser);
	}).catch(function(err){
		next(err);
	});
});
