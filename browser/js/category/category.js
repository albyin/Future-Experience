'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('category', {
        url: '/category/:cat_id',
        templateUrl: 'js/category/category.html',
        controller: "CategoryController"
    });
});

app.controller("CategoryController", function($scope, ListItemFactory, $stateParams, AuthService){
	$scope.id = $stateParams.cat_id;

    $scope.searchTerm = '';

    AuthService.getLoggedInUser().then(function(user) {
        $scope.currentUser = user || "Guest";
    });

	ListItemFactory.getListItemsForCategory($stateParams.cat_id).then(function(listItems){
		$scope.listItems = listItems;
	});



});

app.factory("CategoryFactory", function($http){
    return{
        getAllCategories: function(){
            return $http.get("/api/category")
                .then(function(response){
                    return response.data;
                });
        }
    };
});