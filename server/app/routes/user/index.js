'use strict';

var router = require('express').Router();
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var _ = require('lodash');
module.exports = router;

// sign up
//TODO -- make sure working properly!
router.post('/signup', function(req, res, next) {
	var newUser = req.body;

	if (newUser.password !== newUser.passwordConfirm) {
		var error = new Error('Passwords do not match');
		error.status = 401;
		return next(error);
	}


	delete newUser.passwordConfirm;
	User.create(newUser, function(err, returnedUser) {
		if (err) return next(err);
		res.send(returnedUser);
		req.logIn(returnedUser, function (err) {
			if (err) return next(err);
			// We respond with a reponse object that has user with _id and email.
			res.status(200).send({ user: _.omit(returnedUser.toJSON(), ['password', 'salt']) });
		});

	});
});

//Get All users
router.get('/', function (req, res, next) {
	User.find({}, function(err,foundUser){
		if (err) return next(err);
		res.send(foundUser);
	});
});

//Get single user
router.get('/:user_id', function (req, res, next) {
	User.findById(req.params.user_id, function(err, user) {
		if (err) return next(err);

		res.json(user);
	});
});

router.put('/:user_id', function(req, res, next) {
	var user_id = req.params.user_id;
	if (!user_id) return next(new Error("Specify user id"));

	User.findById(user_id, function(err, user) {
		if (err) return next(err);
		_.extend(user, req.body);

		user.save(function(err, savedData){
			if (err) return next(err);
			res.status(200).json(savedData);
		})

	});
});

router.delete('/:user_id', function(req, res, next){
	var queryId = req.params.user_id;
	if(!queryId) return next(new Error("Please specify an Id"));

	User.findByIdAndRemove(queryId, function(err, removedUser){
		if (err) return next(err);
		res.send(removedUser);
	});
});
