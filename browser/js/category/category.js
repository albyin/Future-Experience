'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('category', {
        url: '/category/:cat_id',
        templateUrl: 'js/category/category.html',
        controller: "CategoryController"
    });
});

app.controller("CategoryController", function($scope, ListItemFactory, CategoryFactory, $stateParams){
	$scope.id = $stateParams.cat_id;
    $scope.category = null;

    $scope.searchTerm = '';

	ListItemFactory.getListItemsForCategory($stateParams.cat_id).then(function(listItems){
		$scope.listItems = listItems;
	});

    CategoryFactory
        .getCategoryById($scope.id)
        .then(function(category) {
            $scope.category = category;
        });
});

app.factory("CategoryFactory", function($http){
    return{
        getAllCategories: function(){
            return $http.get("/api/category")
                .then(function(response){
                    return response.data;
                });
        },
        getCategoryById : function(id) {
            return $http.get("/api/category/"+id)
                .then(function(response){
                    return response.data;
                });
        }
    };
});