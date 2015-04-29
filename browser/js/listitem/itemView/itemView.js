'use strict';
app.directive('itemView', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {
            item : '='
        },
        templateUrl: 'js/listitem/itemView/itemView.html',
        link: function (scope) {

        }
    };

});