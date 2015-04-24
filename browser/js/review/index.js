'use strict';
// app.config(function ($stateProvider) {
//     $stateProvider.state('review', {
//         url: "",
//         templateUrl: "",
//         controller: ""
//     });
// });

// app.controller("", function($scope, ListItemFactory, $stateParams){

// });


app.factory("ReviewFactory", function($http, AuthService){
	return {
		getReviewsForProduct: function(product_id){
			return $http.get("/api/review/product/" + product_id)
			.then(function(response){
				return response.data;
			});
		},
		addNewReview: function (formdata){
			AuthService.getLoggedInUser()
			.then(function(user){
				// {user: user.id, }
				formdata.user = user._id;
				return $http.post("/api/review/", formdata);
			})
			.then(function(response){
				return response.data;
			});
			
		}
	};
});