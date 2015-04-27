app.directive('addToCart', function () {
    return {
        restrict : 'E',
        templateUrl : 'js/cart/add-to-cart/add-to-cart.html',
        scope : {
            item: '='
        },
        link : function(scope, element, attr) {
            //scope.item.product.name
            scope.addToCart = function() {
                console.log(scope.item.product.name);
            };
        }
    };
});