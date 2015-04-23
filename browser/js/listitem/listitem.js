'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('listItem', {
        url: '/listitem/:listItemId',
        templateUrl: 'js/category/category.html',
        controller: "ListItemController"
    });
});

app.controller("ListItemController", function($scope, ListItemFactory, $stateParams){
	ListItemFactory.getSingleListItem($stateParams.listItemId).then(function(listitem){
		$scope.listitem = listitem;
	});	
});


app.factory("ListItemFactory", function($http){
	return {
		getListItemsForCategory: function(cat_id){
			//:cat_id will be changed after the backend is done
			return $http.get("/api/listitem/category/" + cat_id)
			.then(function(response){
				return response.data;
			});
		},
		getSingleListItem: function(listItemId){
			return $http.get("/api/listitem/item/" + listItemId)
			.then(function(response){
				return response.data;
			});
		}
	};
});