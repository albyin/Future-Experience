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
    function editProduct (product) {
        return $http.put('/api/product/' + product._id, product)
                    .then(returnResponse);
    }

    function deleteProduct(product){
        return $http.delete('/api/product/' + product._id)
                    .then(returnResponse);
    }

    return {
        getAllProducts : function() {
            return $http
                .get('/api/product')
                .then(returnResponse);
        },
        createProduct: createProduct,
        editProduct: editProduct,
        deleteProduct: deleteProduct
    };
});