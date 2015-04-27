app.config(function ($stateProvider) {
    $stateProvider
        .state('cart.checkout', {
            url : '/cart/checkout',
            templateUrl : 'js/cart/checkout/checkout.html',
            controller: 'CheckoutController',
            controllerAs : 'CheckCtrl'
        });
});

app.controller('CheckController', function ($scope, AuthService, $state, CartFactory) {

});