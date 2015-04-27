app.directive('userPanel', function($rootScope, AccountFactory, AuthService, $state) {
    return {
        restrict : 'E',
        templateUrl : 'js/account/userPanel/user-panel.html',
        scope : {
            user : '='
        },

        link : function(scope, element, attr) {
            scope.showEdit = false;
            scope.buttonText = "Show Edit User";
            scope.profile = angular.copy(scope.user);

            scope.editToggle = function() {
                scope.showEdit = scope.showEdit ? false : true;
                scope.buttonText = scope.showEdit ? "Hide Edit User" : "Show Edit User";
            };

            scope.updateProfile = function(profile) {
                AccountFactory
                    .updateUser(profile._id, profile)
                    .then(function(updatedUser) {
                        scope.user = updatedUser;
                        scope.profile = angular.copy(scope.user);
                        scope.editToggle();
                    });
            };
        }
    };
});