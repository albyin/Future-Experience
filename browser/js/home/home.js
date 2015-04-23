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

	//a function that will do the selection on ng-click to go to a certain category
	//and a function that will take us to a new category statewhen the category icon is clicked 

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