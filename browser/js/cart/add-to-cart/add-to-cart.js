app.controller("addController", function($scope){
    $scope.nums = [1,2,3,4,5];
});

app.directive('addToCart', function (CartService, CartFactory) {
    return {
        restrict : 'E',
        templateUrl : 'js/cart/add-to-cart/add-to-cart.html',
        scope : {
            item: '='
        },
        link : function(scope, element, attr) {
            //scope.item.product.name
            scope.addToCart = function() {

                console.log("scope.item, ",scope.item);
                console.log("scope.item.product.name, ",scope.item.product.name);
                console.log("scope.item.price, ",scope.item.price);
                console.log("cartservice.cart, ",CartService.cart);
                console.log("cartfactory.updateorder, ",CartFactory.updateOrder);

                var newOrder = {
                   listitems : [{
                    item : scope.item._id,
                    quantity : 1
                   }]
                };

                CartFactory.createNewOrder(newOrder).then(function(result) {
                    CartService.cart = result;
                    console.log("cartservice.cart, ", CartService.cart);
                });

            };
        }
    };
});