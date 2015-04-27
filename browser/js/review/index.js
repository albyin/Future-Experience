'use strict';

app.controller('ReviewController', function($stateParams, $scope, ReviewsFactory, AuthService) {
    var reviewCtrl = this;

     reviewCtrl.showButton = null;

    var loggedInUser =  AuthService.getLoggedInUser()
            .then(function(user){
                if(!user) reviewCtrl.showButton = false;
                else reviewCtrl.showButton = true;
                console.log(user);
                reviewCtrl.futureReview.user = user._id;
                console.log(user._id);
                return user._id;
            });

   
    reviewCtrl.futureReview = {
        comment: null,
        stars: null,
        product: null,
        user: null
    };

    reviewCtrl.starsArr = [1,2,3,4,5];

    reviewCtrl.futureReview.product = $stateParams.productId;

    reviewCtrl.addReviews = function(review){
      ReviewsFactory.addReview(reviewCtrl.futureReview)
        .then(function(review){
            $scope.reviews.push(review);
        }).catch(function(err){
            console.log(err);
        });
    };
});

app.factory('ReviewsFactory', function ($http) {
    return {
        addReview: function(review){
            return $http.post('/api/review', review).then(function(response){
                return response.data;
            }, function(err){
                console.log(err);
            });
        },
       getReviewsForProduct: function(product_id){
			return $http.get("/api/review/product/" + product_id)
			.then(function(response){
				return response.data;
			});
		}   
    };
});