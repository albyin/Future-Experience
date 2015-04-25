app.config(function ($stateProvider) {

    $stateProvider
        .state('account', {
            controller: 'AccountController',
            controllerAs: 'acctCtrl',
            abstract : true,
            template : '<ui-view/>',
            data : {
                authenticate : true
            }
        })
        .state('account.member', {
            url         : '/my-account',
            templateUrl : 'js/account/templates/member.html'
        })
        .state('account.admin', {
            url         : '/admin',
            templateUrl : 'js/account/templates/admin.html'
        });

});

app.controller('AccountController', function($scope, AuthService, $state) {

});