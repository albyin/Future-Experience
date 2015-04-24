'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('listItem', {
        url: '/listitems/item/:listItemId',
        templateUrl: 'js/listitem/listitem.html',
        controller: "ListItemController"
    });
});

app.controller("ListItemController", function($scope, ListItemFactory, $stateParams){
	$scope.id = $stateParams.listItemId;

	ListItemFactory.getSingleListItem($stateParams.listItemId).then(function(listitem){
		$scope.listitem = listitem;
	});	
});


app.factory("ListItemFactory", function($http){
	return {
		getListItemsForCategory: function(cat_id){
			//:cat_id will be changed after the backend is done
			return $http.get("/api/listitems/category/" + cat_id)
			.then(function(response){
				console.log(response)
				return response.data;
			});
		},
		getSingleListItem: function(listItemId){
		
			return $http.get("/api/listitems/item/" + listItemId)
			.then(function(response){
				console.log(response.data);
				return response.data
			});
		}
	};
});