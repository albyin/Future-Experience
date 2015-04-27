app.directive('createListItem', function($rootScope, ListItemFactory, AuthService, $state) {\
    return {
        restrict : 'E',
        templateUrl : 'js/account/directives/listitemPanel/create-new-listitem/create-new-listitem.html',
        scope : {
            listitem : '='
        },

        link : function(scope, element, attr) {
            scope.showEdit = true;
            scope.buttonText = "Create New List Item";
            scope.listItemProfile = angular.copy(scope.listItem);

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
                            scope.listItem = createdItem;
                            scope.listItemProfile = angular.copy(scope.listItem);
                            scope.editToggle();
                        });
                });
            };
        }
    };
});