'use strict';
app.directive('recommendations', function($rootScope, FacebookFactory, ListItemFactory, $q) {
    return {
        restrict : 'E',
        templateUrl : 'js/recommendations/recommendations.html',
        scope : {
            category : '='
        },
        link : function(scope, element, attr) {
            scope.recommendations = null;

            var fblikes, listitems;

            $q
                .all([
                    FacebookFactory.getLikes(),
                    ListItemFactory.getListItemsForCategory(scope.category._id)
                ])
                .then(function(results) {
                    fblikes = results[0];
                    console.log(fblikes);
                    listitems = results[1];
                

                    scope.recommendations = listitems.filter(function(item) {
                        var intersect = _.intersection(item.tags, fblikes);

                        if (intersect.length) {
                            return true;
                        } else {
                            return false;
                        }
                    }).slice(0, 4);
                });
        }
    };
});