'use strict';

app.controller('ReviewController', function ($stateParams, $scope, ReviewsFactory, AuthService, ListItemFactory) {
    var reviewCtrl = this;

    reviewCtrl.showForm = false;
    reviewCtrl.showButton = null;
    reviewCtrl.starsArr = [1, 2, 3, 4, 5];
    reviewCtrl.reviews = null;

    reviewCtrl.futureReview = {
        comment: null, //set in .html
        stars  : null, //set in .html
        product: null,
        user   : null // set by AuthService.getLoggedIn.....
    };

    AuthService.getLoggedInUser()
        .then(function (user) {
            reviewCtrl.creator = user;
            if (!user) {
                reviewCtrl.showButton = false;
            } else {
                reviewCtrl.showButton = true;
                reviewCtrl.futureReview.user = user._id;
                return user._id;
            }
        });

    ListItemFactory.getSingleListItem($stateParams.listItemId).then(function (listitem) {
        reviewCtrl.futureReview.product = listitem.product._id;
        return listitem;
    }).then(function (listitem) {
        ReviewsFactory.getReviewsForProduct(listitem.product._id).then(function (reviews) {
            reviewCtrl.reviews = reviews;
        });
    });

    reviewCtrl.addReviews = function () {

        ReviewsFactory.addReview(reviewCtrl.futureReview)
            .then(function (review) {
                reviewCtrl.reviews.push(review);
                reviewCtrl.showForm = false;
            }).catch(function (err) {
                console.log(err);
            });
    };

    reviewCtrl.deleteReviews = function (review) {
        var review = review;
        ReviewsFactory.deleteReview(review._id)
            .then(function () {
                $scope.reviews.filter(function (e) {
                    return e._id !== review._id;
                });
            }).catch(function (err) {
                console.log(err);
            });
    };

    reviewCtrl.updateReviews = function (review) {
        ReviewsFactory.updateReview(review._id).then(function (review) {
            $scope.review = review;
        }, function (err) {
            console.log(err);
        });
    };

    reviewCtrl.toggleReviewForm = function () {
        reviewCtrl.showForm = !reviewCtrl.showForm;
    };

});

app.factory('ReviewsFactory', function ($http) {
    return {
        addReview           : function (review) {
            return $http.post('/api/review', review).then(function (response) {
                return response.data;
            }, function (err) {
                console.log(err);
            });
        },
        getReviewsForProduct: function (product_id) {
            return $http.get("/api/review/product/" + product_id)
                .then(function (response) {
                    return response.data;
                }, function (err) {
                    console.log(err);
                });
        },
        updateReview        : function (review_id) {
            return $http.put('/api/review/' + review_id).then(function (response) {
                return response.data;
            }, function (err) {
                console.log(err);
            });
        },
        deleteReview        : function (reviewId) {
            return $http.delete('/api/review/' + reviewId).then(function (response) {
                if (response.status !== 200) throw new Error("Deletion error.");
                return response.status;
            }, function (err) {
                console.log(err);
            });
        }
    };
});