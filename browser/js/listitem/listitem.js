'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('listItem', {
        url: '/listitem/:listItemId',
        templateUrl: 'js/listitem/listitem.html',
        controller: "ListItemController"
    });
});

app.controller("ListItemController", function($scope, ListItemFactory, ReviewsFactory, $stateParams, CartService){
	$scope.id = $stateParams.listItemId;
	$scope.showForm = false;

	ListItemFactory.getSingleListItem($stateParams.listItemId).then(function (listitem){
		$scope.listitem = listitem;
		return listitem;
	})
	.then(function (listitem){
		ReviewsFactory.getReviewsForProduct(listitem.product._id).then(function (reviews){
			$scope.reviews = reviews;
		});
	});	

	$scope.toggleReviewForm = function () {
		$scope.showForm = !$scope.showForm;
	};

	$scope.reviewForm = {};

	$scope.submitReview = function(review) {
		// ReviewFactory.addNewReview(review).then(function(){})
	};

	//$scope.addToCart = function(list_id, quanity) {
	//	CartService.addToCart(list_id, quanity);
	//};
});

app.factory("ListItemFactory", function($http){
	return {
		getListItemsForCategory: function(cat_id){
			//:cat_id will be changed after the backend is done
			return $http.get("/api/listitems/category/" + cat_id).then(returnResponse);
		},
		getSingleListItem: function(listItemId){
			return $http.get("/api/listitems/item/" + listItemId).then(returnResponse);
		},
		getListItems : function() {
			return $http.get("/api/listitems").then(returnResponse);
		}
	};
});