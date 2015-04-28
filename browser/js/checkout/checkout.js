app.config(function ($stateProvider) {
    $stateProvider
        .state('checkout', {
            url : '/checkout',
            templateUrl : 'js/checkout/checkout.html',
            controller: 'CheckOutController'
        }).state('checkout.paid', {
            url : '/thank-you',
            templateUrl : 'js/checkout/paid.html'
        });
});

app.controller('CheckOutController', function ($scope, AuthService, $state, CartFactory) {
    $scope.cart = CartFactory.getCart();
    $scope.paid = false;

    $scope.processPayment = function() {
        $scope.paid = true;
        $state.go("checkout.paid");
    };

    function init() {
        if (!$scope.cart.listitems.length) return;
        if ($scope.cart._id) return;

        console.log("here");
        AuthService.getLoggedInUser().then(function(user) {
            var cartToCreate = {
                listitems : $scope.cart.listitems.map(function(cartItem) {
                return {
                    item : cartItem.item._id,
                    quanity : cartItem.quantity
                };
            })};

            if (user) {
                cartToCreate.user = user._id;
            }

            CartFactory.createNewOrder(cartToCreate).then(function(savedCart) {
                $scope.cart = angular.extend({}, savedCart, $scope.cart);
            });
        });
    }

    init();
});
