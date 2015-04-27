'use strict';

app.controller('ReviewController', function($stateParams, $scope, ReviewsFactory, AuthService) {
    var reviewCtrl = this;

     reviewCtrl.showButton = null;

    var loggedInUser =  AuthService.getLoggedInUser()
            .then(function(user){
                if(!user) {
                    reviewCtrl.showButton = false;
                } else {
                    reviewCtrl.showButton = true;
                    reviewCtrl.futureReview.user = user._id;
                    return user._id;
                }
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
//i have to refresh to see changes. maybe try to use splice and index
       reviewCtrl.deleteReviews = function(review){
       ReviewsFactory.deleteReview(review._id).then(function(review){
           $scope.reviews.filter(function(e){
               return e._id !== review._id;
           });
       }, function(err){
           console.log(err);
       });
    };



     reviewCtrl.updateReviews = function(review){
       ReviewsFactory.updateReview(review._id).then(function(review){
           $scope.review = review;
       }, function(err){
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
            }, function(err){
                console.log(err);
            });
        },
        updateReview: function(review_id){
            return $http.put('/api/review/'+review_id).then(function(response){
                console.log(response.data);
                return response.data;
            }, function(err){
                console.log(err);
            });
        },
        deleteReview: function(reviewId){
            console.log(reviewId);
            return $http.delete('/api/review/'+reviewId).then(function(response){
                return response.data;
            }, function(err){
                console.log(err);
            });
        }   
    };
});