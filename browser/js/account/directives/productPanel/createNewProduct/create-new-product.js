app.directive('createNewProduct', function($rootScope, CartFactory, AuthService, $state, Upload, ProductFactory) {
    return {
        restrict : 'E',
        templateUrl : 'js/account/directives/productPanel/createNewProduct/create-new-product.html',
        scope : {
            product : '='
        },

        link : function(scope, element, attr) {
            scope.showEdit = false;
            scope.buttonText = "Create New Product";
            scope.products = [];

            scope.editToggle = function() {
                scope.showEdit = scope.showEdit ? false : true;
                scope.buttonText = scope.showEdit ? "Quit New Product" : "Create New Product";
            };

            scope.newProduct = {
                name: null,
                image: null,
                details: null
            };

            scope.uploadFile = function (files) {
                if (files) {
                    console.log(files);
                }
                Upload.upload({
                    url: 'api/product/upload',
                    file: files
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    scope.newProduct.image = data;
                    console.log("newProduct: ", scope.newProduct);
                });
            };

            scope.newProductSend = function (product) {
                ProductFactory.createProduct(product).then(function (product) {
                    scope.products.push(product);
                    alert("New product successfully added!");
                    scope.editToggle();
                });
            };
        }
    };
});