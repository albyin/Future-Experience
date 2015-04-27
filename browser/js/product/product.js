'use strict';
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('category.product', {
            url: '/product/:product_id',
            templateUrl: 'js/product/product.html',
            controller: "ProductController",
            controllerAs: "product"
        });
});
app.controller("ProductController", function($scope, $stateParams, categoryId){
    this.placeHolder = "Here is Product in Category #"+categoryId;
});


app.factory("ProductFactory", function($http){
    function createProduct (product) {
        return $http.post('/api/product', product)
                    .then(returnResponse);
    }

    return {
        getAllProducts : function() {
            return $http
                .get('/api/product')
                .then(returnResponse);
        },
        createProduct: createProduct
    };
});