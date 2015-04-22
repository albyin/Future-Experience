/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

Refer to the q documentation for why and how q.invoke is used.

*/

var mongoose = require('mongoose');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Promise = require('bluebird');
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Category = Promise.promisifyAll(mongoose.model('Category'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var q = require('q');
var chalk = require('chalk');

var getCurrentUserData = function () {
    return q.ninvoke(User, 'find', {});
};

var getCurrentListItems = function () {
    return ListItem.findAsync({});
};

var seedUsers = function () {

    var users = [
        {   firstName: 'Vasya',
            lastName: 'Smith',
            email: 'testing@fsa.com',
            password: 'password'
        },
        {   firstName: 'Barack',
            lastName: 'Obama',
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return q.invoke(User, 'create', users);

};

var seedListItems = function() {
    var categoryTestArr = [{name: 'Final Frontier'}, {name: 'Space'}];
    var productTestArr = [
        {name: 'Toilet paper', image: 'something.jpeg', details: 'description'},
        {name: 'Eye Liner', image: 'usefulStuff.jpeg', details: 'importantInfo'}
    ];

     var promises = [];
        promises.push(Category.createAsync(categoryTestArr));
        promises.push(Product.createAsync(productTestArr));

    return Promise
        .all(promises)
        .then(function(testArr){
            // console.log(testArr);
        var categoryFF = testArr[0][0];
        var categoryS = testArr[0][1];
        var productTP = testArr[1][0];
        var productEL = testArr[1][1];

        return ListItem.createAsync([
            {quantity: 5, price: 100, product: productTP.id, category: categoryS.id},
            {quantity: 3, price: 2000, product: productEL.id, category: categoryS.id},
            {quantity: 8, price: 500, product: productTP.id, category: categoryFF.id},
            {quantity: 10, price: 300, product: productEL.id, category: categoryFF.id}
            ]);
        });
};

connectToDb.then(function () {
    getCurrentUserData().then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
        }
    }).then(function() {
        return getCurrentListItems();
    }).then(function(items) {
        if (items.length === 0) {
            return seedListItems();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});