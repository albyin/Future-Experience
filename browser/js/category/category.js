'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('category', {
        url: '/category/:cat_id',
        templateUrl: 'js/category/category.html',
        controller: "CategoryController"
    });
});

app.controller("CategoryController", function($scope, ListItemFactory, $stateParams){
	$scope.id = $stateParams.cat_id;
	// console.log($scope.id);
	ListItemFactory.getListItemsForCategory($stateParams.cat_id).then(function(listItems){
		
		$scope.listItems = listItems;
		// $scope.listitems = listitems.map(function(el){
		// 	return { product: el.product, 
		// 			 // details: el.details, 
		// 			 price: el.price, 
		// 			 // picture: el.picture 
		// 	};
		// });
	});	
});

// moved to listitem.js

// app.factory("ListItemFactory", function($http){
// 	return{
// 		getListItemsForCategory: function(){
// 			//:cat_id will be changed after the backend is done
// 			return $http.get("/api/listitem/category/:cat_id")
// 			.then(function(response){
// 				return response.data;
// 			});
// 		}
// 	};
// });