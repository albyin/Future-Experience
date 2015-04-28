app.directive('recommendations', function($rootScope, ListItemFactory, FacebookFactory, ProductFactory, $q) {
    return {
        restrict : 'E',
        templateUrl : 'js/recommendations/recommendations.html',
        scope : {},

        link : function(scope, element, attr) {
            scope.recommendations = null;

            var fblikes, products;

            $q
                .all([
                    FacebookFactory.getLikes(),
                    ProductFactory.getAllProducts()
                ])
                .then(function(results) {
                    fblikes = results[0];
                    products = results[1];

                    scope.recommendations = products.filter(function(item) {
                        var intersect = _.intersection(item.tags, fblikes);

                        if (intersect.length) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                });
        }
    };
});