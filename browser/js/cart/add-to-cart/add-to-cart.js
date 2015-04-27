app.directive('addToCart', function () {
    return {
        restrict : 'E',
        templateUrl : 'js/cart/add-to-cart/add-to-cart.html',
        scope : {
            item: '='
        },
        link : function(scope, element, attr) {
            console.log(scope);
        }
    };
});