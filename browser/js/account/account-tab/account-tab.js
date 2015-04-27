'use strict';
app.directive('userTab', function ($rootScope, AuthService, AUTH_EVENTS, $state) {
    return {
        restrict : 'E',
        scope : {},
        templateUrl : 'js/account/account-tab/account-tab.html',
        link : function(scope) {
            scope.items = [
                { label : 'View/Edit Profile', state : 'user.member.profile', current : 'user.member'},
                { label : 'View Orders', state : 'user.member.orders', current : 'user.member'},
                { label : 'Users', state : 'user.admin.users', current : 'user.admin'},
                { label : 'Orders', state : 'user.admin.orders', current : 'user.admin'},
                { label : 'Products', state : 'user.admin.products', current : 'user.admin'},
                { label : 'List Items', state : 'user.admin.listitems', current : 'user.admin'}
            ];

            scope.isCurrentState = function(current) {
                return $state.includes(current);
            };
        }
    };
});