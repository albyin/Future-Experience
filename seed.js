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
var Promise = require('bluebird');
var User = Promise.promisifyAll(mongoose.model('User'));
var ListItem = Promise.promisifyAll(mongoose.model('ListItem'));
var Category = Promise.promisifyAll(mongoose.model('Category'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Order = Promise.promisifyAll(mongoose.model('Order'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var q = require('q');
var chalk = require('chalk');

var getCurrentUserData = function () {
    return q.ninvoke(User, 'find', {});
};

var getCurrentListItems = function () {
    return ListItem.findAsync({});
};

var getCurrentOrders = function () {
    return Order.findAsync({});
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
            password: 'potus',
            userType: 2
        },
        {   firstName: 'Joe',
            lastName: 'Biden',
            email: 'Joe@vpotus.com',
            password: 'lean'
        },
        {   firstName: 'Hillary',
            lastName: 'Clinton',
            email: 'Hillary@clinton.com',
            password: 'iwannabepotus'
        },

    ];

    return User.createAsync(users);
};

var seedListItems = function(users) {
    var categoryTestArr = [{
        name: 'Space Colonization',
        description : 'Lorem Ipsum',
        image : 'images/space.jpg'
    }, {
        name: 'Zombie Apocalypse',
        image : 'images/zombie.jpg',
        description : 'Lorem Ipsum'
    }];
    var productTestArr = [
        {
            name: 'Toilet paper',
            //image: 'images/spacetoilet.gif',
            details: 'description'
        },
        {
            name: 'Eye Liner',
            //image: 'images/usefulStuff.jpeg',
            details: 'importantInfo'
        }
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

            var createArr = [];
            for (var i = 0; i < 16; i++) {
                if (i % 2) {
                    createArr.push({quantity: 5, price: 100, product: productTP.id, category: categoryS.id, tags: ['The Colbert Report']});
                } else {
                    createArr.push({quantity: 3, price: 2000, product: productEL.id, category: categoryFF.id, tags: ['Fullstack Academy']});
                }
            }

            return ListItem.createAsync(createArr)
            .then(function (listitems){
                var review1 = {
                    user : users[0].firstName,
                    product : productTP.id,
                    comment : "This is OK",
                    stars : 4
                };
                var review2 = {
                    user : users[1].firstName,
                    product : productTP.id,
                    comment : "This is pretty good",
                    stars : 3
                };
                var review3 = {
                    user : users[2].firstName,
                    product : productEL.id,
                    comment : "This is Great",
                    stars : 5
                };

                return Review.createAsync([ review1, review2, review3 ])
                .then(function() {
                    return listitems;
                })
                .catch(function(err) {
                    console.log(err);
                    process.kill(0);
                });
            });
        });
};

connectToDb.then(function () {
    getCurrentUserData().then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data!'));
            return users;
        }
    }).then(function(users) {
        return getCurrentListItems()
            .then(function (items) {
                if (items.length === 0) {
                    return seedListItems(users);
                } else {
                    console.log(chalk.magenta('Seems to already be list data!'));
                    return items;
                }
            }).then(function (listItems) {
                return getCurrentOrders()
                    .then(function (orders) {
                        if (orders.length === 0) {
                            return listItems;
                        } else {
                            console.log(chalk.magenta('Seems to already be orders data! Exiting!'));
                            process.kill(0);
                        }
                    });
            }).then(function (listItems) {
                return Order.createAsync([
                    {
                        listitems: [{
                            item: listItems[0],
                            quantity: 2
                        }],
                        user: users[0].id
                    },
                    {
                        listitems: [{
                            item: listItems[1],
                            quantity: 2
                        }],
                        user: users[1].id
                    }
                ]);
            })
            .then(function () {
                console.log(chalk.green('Seed successful!'));
                process.kill(0);
            }).catch(function (err) {
                console.error(err);
                process.kill(1);
            });
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
}).catch(function (err) {
    console.error(err);
    process.kill(1);
});