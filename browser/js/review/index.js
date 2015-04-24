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


app.factory("ReviewFactory", function($http){
	return {
		getReviewsForProduct: function(product_id){
			//:cat_id will be changed after the backend is done
			console.log('GOT HERE');
			return $http.get("/api/review/product/" + product_id)
			.then(function(response){
				console.log("REVIEW FACTORY RESPONSE data, ", response.data);
				return response.data;
			});
		}
	};
});