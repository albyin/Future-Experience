app.directive('editProduct', function($rootScope, ProductFactory, AuthService, $state) {
    return {
        restrict : 'E',
        templateUrl : 'js/account/directives/productPanel/editProduct/edit-product.html',
        scope : {
            product : '='
        },

        link : function(scope, element, attr) {
            scope.showEdit = false;
            scope.buttonText = "Edit Product";
            scope.productProfile = angular.copy(scope.product);
            scope.areYouSure = false;

            scope.editToggle = function() {
                scope.showEdit = scope.showEdit ? false : true;
                scope.buttonText = scope.showEdit ? "Close Editor" : "Edit Product";
            };

            scope.editProductSend = function(product) {
                ProductFactory
                    .editProduct(product)
                    .then(function(updatedProduct) {
                        console.log('update: ', updatedProduct);
                        scope.product = updatedProduct;
                        scope.productProfile = angular.copy(scope.product);
                        scope.editToggle();
                    });
            },

             scope.removeProduct = function(){
                ProductFactory.deleteProduct(scope.product).then(function(){
                    angular.element(element.parent()).remove();
                });
            };
        }
    };
});