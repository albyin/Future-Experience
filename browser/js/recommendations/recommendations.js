app.directive('recommendations', function($rootScope, ListItemFactory, FacebookFactory, AuthService, $state) {
    return {
        restrict : 'E',
        templateUrl : 'js/recommendations/recommendations.html',
        scope : {},

        link : function(scope, element, attr) {
            scope.facebookResult = null;

            FacebookFactory.getLikes().then(function(likes) {
                console.log(likes);
                scope.facebookResult = likes.data;
            });
        }
    };
});