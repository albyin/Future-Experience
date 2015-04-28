app.directive('editListItem', function($rootScope, ListItemFactory, AuthService, CategoryFactory, $state, ProductFactory) {
    return {
        restrict : 'E',
        templateUrl : 'js/account/directives/listitemPanel/edit-list-item/edit-list-item.html',
        scope : {
            listitem : '='
        },

        link : function(scope, element, attr) {
            scope.showEdit = false;
            scope.buttonText = "Edit List Item";
            scope.current = {
                category: scope.listitem.category,
                product: scope.listitem.product
            };
            scope.listitems = [];

            scope.listItemProfile = angular.copy(scope.listitem);

            ProductFactory.getAllProducts().then(function (products) {
                scope.products = products;
            });

            CategoryFactory.getAllCategories().then( function (categories) {
                scope.categories = categories;
            });

            scope.editToggle = function() {
                scope.showEdit = scope.showEdit ? false : true;
                scope.buttonText = scope.showEdit ? "Close Editor" : "Edit List Item";
            };

            scope.editListItem = function (item) {
                AuthService.getLoggedInUser().then(function (user) {
                     ListItemFactory
                        .editListItem(item)
                        .then(function (editedItem) {
                            scope.listitem = editedItem;
                            scope.editToggle();
                        });
                });
            };
        }
    };
});