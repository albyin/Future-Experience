'use strict';
var router = require('express').Router();
var bluebird = require('bluebird');
var _ = require('lodash');
var request = require('request');
var mongoose = require('mongoose');
var User = mongoose.model("User");
module.exports = router;

router.get('/likes', function(req, res, next) {
    if (!req.user || !req.user.facebook || !req.user.facebook.id) return next(new Error("facebook not linked"));

    User
        .findById(req.user._id)
        .select('+facebook.token')
        .exec()
        .then(function(userToken) {
            var access_token = userToken.facebook.token;

            var options = {
                uri: 'https://graph.facebook.com/me/likes?access_token=' + access_token,
                method: 'GET'
            };

            request(options, function(err, response, body) {
                if (err) return next(err);

                var likes = JSON.parse(body).data.map(function(like) {
                   return like.name;
                });

                res.json(likes);
            });
        });
});

