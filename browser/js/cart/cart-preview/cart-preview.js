app.directive('cartPreview', function ($rootScope, $state) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/cart/cart-preview/cart-preview.html',
        controller: 'CartController',
        controllerAs: 'CartCtrl'
    };
});