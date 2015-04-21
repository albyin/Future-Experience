'use strict';
var passport = require('passport');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (email, password, done) {
    // select comes from userModel and it set to false initially. '+' overrides the boolean and selects the property
        UserModel.findOne({ email: email }).select('email +salt +password').exec(function (err, user) {
            if (err) return done(err);
            // user.correctPassword is a method from our UserModel schema.
            if (!user || !user.correctPassword(password)) return done(null, false);
            // Properly authenticated.
            done(null, user);
        });
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {

        var authCb = function (err, user) {

            if (err) return next(err);

            if (!user) {
                var error = new Error('Invalid login credentials');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function (err) {
                if (err) return next(err);
                // We respond with a reponse object that has user with _id and email.
                res.status(200).send({ user: user });
            });

        };

        passport.authenticate('local', authCb)(req, res, next);

    });

    // sign up
    app.post('/signup', function(req, res, next) {
        var newUser = req.body;

        if (newUser.password !== newUser.passwordConfirm) {
            var error = new Error('Passwords do not match');
            error.status = 401;
            return next(error);
        }

        delete newUser.passwordConfirm;

        UserModel.create(newUser, function(err, returnedUser) {
            if (err) return next(err);

            req.logIn(returnedUser, function (err) {
                if (err) return next(err);
                // We respond with a reponse object that has user with _id and email.
                res.status(200).send({ user: _.omit(returnedUser.toJSON(), ['password', 'salt']) });
            });

        });
    });

};