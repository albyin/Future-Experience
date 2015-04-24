'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html', 
        controller: "HomeController"
    });
});

app.controller("HomeController", function($scope, CategoryFactory){
	CategoryFactory.getAllCategories().then(function(categories){
		$scope.categories = categories;
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