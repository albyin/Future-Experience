'use strict';
// // app.config(function ($stateProvider) {
// //     $stateProvider.state('review', {
// //         url: "",
// //         templateUrl: "",
// //         controller: ""
// //     });
// // });

// // app.controller("", function($scope, ListItemFactory, $stateParams){

// // });


// // app.controller("ReviewController", function($scope, ReviewFactory, AuthService){
// // 	// AuthService.getLoggedInUser()
// // 	// 		.then(function(user){
// // 	// 			// {user: user.id, }
// // 	// 			return user._id;
// // });
			
// 		// });

// app.factory("ReviewFactory", function($http, AuthService){
// 	return {
// 		getReviewsForProduct: function(product_id){
// 			return $http.get("/api/review/product/" + product_id)
// 			.then(function(response){
// 				return response.data;
// 			});
// 		},
// 		addNewReview: function (formdata){
// 			// AuthService.getLoggedInUser()
// 			// .then(function(user){
// 			// 	// {user: user.id, }
// 			// 	formdata.user = user._id;
// 				return $http.post("/api/review/", formdata);
// 			})
// 			.then(function(response){
// 				return response.data;
// 			});
			
// 		}
// 	};
// });


app.controller('ReviewController', function($stateParams, $scope, ReviewsFactory, AuthService) {
    var reviewCtrl = this;
    
    reviewCtrl.futureReview = {
        comment: null,
        stars: null,
        product: null,
        user: null
    };


    $scope.number = 5;
    $scope.getMaxReviewValue = function(num) {
        return new Array(num);   
    }   
    reviewCtrl.futureReview.product = $stateParams.productId;

    reviewCtrl.addReviews = function(review){
        console.log(review);

        AuthService.getLoggedInUser()
			.then(function(user){
				// {user: user.id, }
                console.log(user);
				return user._id;
        }).then(function(user_id){
            reviewCtrl.futureReview.user = user_id;
            return ReviewsFactory.addReview(reviewCtrl.futureReview)
        }).then(function(review){
            console.log(review);
            $scope.reviews.push(review);
        }).catch(function(err){
            console.log(err);
        })


    };
});

app.factory('ReviewsFactory', function ($http) {
    return {
        addReview: function(review){
        	//review or reviews in the url, I don't know
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