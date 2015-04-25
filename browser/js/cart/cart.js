app.config(function ($stateProvider) {
    $stateProvider
        .state('cart', {
            url : '/cart',
            templateUrl : 'js/cart/cart.html',
            controller: 'CartController',
            controllerAs : 'CartCtrl'
        });
});

app.service('CartService', function($rootScope, CartFactory) {
   this.cart = {
       cartAmount : 0
   };
});

app.controller('CartController', function ($scope, AuthService, $state, CartFactory, CartService) {
    $scope.cart = CartService.cart;
});

app.factory('CartFactory', function($http) {
   return {};
});