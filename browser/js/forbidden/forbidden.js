app.config(function ($stateProvider) {

    $stateProvider
        .state('403', {
            url         : '/403',
            templateUrl : 'js/forbidden/forbidden.html'
        });

});