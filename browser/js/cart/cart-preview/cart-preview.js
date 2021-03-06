app.directive('cartPreview', function ($rootScope, $state, CartFactory) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/cart/cart-preview/cart-preview.html',
        link : function(scope, element, attr) {
            scope.cart = CartFactory.getCart();
        }
    };
});