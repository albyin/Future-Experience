app.directive('createListItem', function($rootScope, ListItemFactory, AuthService, CategoryFactory, $state, ProductFactory) {
    return {
        restrict : 'E',
        templateUrl : 'js/account/directives/listitemPanel/create-new-listitem/create-new-listitem.html',
        scope : {
            listitem : '='
        },

        link : function(scope, element, attr) {
            scope.showEdit = false;
            scope.buttonText = "Create New List Item";
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
                scope.buttonText = scope.showEdit ? "Close Editor" : "Create List Item";
            };


            scope.createListItem = function (item) {
                AuthService.getLoggedInUser().then(function (user) {
                    item.creator = user._id;
                    ListItemFactory
                        .createListItem(item)
                        .then(function (createdItem) {
                            scope.listitems.push(createdItem);
                            alert('New List Item added. Good job!');
                            scope.editToggle();
                        });
                });
            };
        }
    };
});