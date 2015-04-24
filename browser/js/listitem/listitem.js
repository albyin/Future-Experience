'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('listItem', {
        url: '/listitem/:listItemId',
        templateUrl: 'js/listitem/listitem.html',
        controller: "ListItemController"
    });
});

app.controller("ListItemController", function($scope, ListItemFactory, ReviewFactory, $stateParams){
	$scope.id = $stateParams.listItemId;
	$scope.showForm = false;

	ListItemFactory.getSingleListItem($stateParams.listItemId).then(function (listitem){
		$scope.listitem = listitem;
		return listitem;
	})
	.then(function (listitem){
		console.log("LISTITEM, ", listitem);
		ReviewFactory.getReviewsForProduct(listitem.product._id).then(function (reviews){
			//should give us array of reviews
			$scope.reviews = reviews;
			console.log("REVIEWS,", $scope.reviews);
		});
	});	

	$scope.toggleReviewForm = function () {
		$scope.showForm = !$scope.showForm;
	};

	$scope.reviewForm = {};

	$scope.submitReview = function(review) {
		console.log(review);
	};

});


app.factory("ListItemFactory", function($http){
	return {
		getListItemsForCategory: function(cat_id){
			//:cat_id will be changed after the backend is done
			return $http.get("/api/listitems/category/" + cat_id)
			.then(function(response){
				return response.data;
			});
		},
		getSingleListItem: function(listItemId){
		
			return $http.get("/api/listitems/item/" + listItemId)
			.then(function(response){
				return response.data;
			});
		}
	};
});