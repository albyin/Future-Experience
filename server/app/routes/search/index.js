'use strict';
var router = require('express').Router();
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var ListItem = bluebird.promisifyAll(mongoose.model('ListItem'));
module.exports = router;
var _ = require('lodash');

// var ensureAuthenticated = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.status(401).end();
//     }
// };

router.get('/', function (req, res, next) {
	var filterOption = req.query;
	ListItem
	.searchList(filterOption, function(err, lists) {
		if (err) return next(err);

		res.json(lists);
	});
});
