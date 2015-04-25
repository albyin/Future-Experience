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

app.controller('AccountController', function($scope, AuthService, AccountFactory, $state) {
    $scope.user = null;
    $scope.showProfile = false;

    AuthService.getLoggedInUser().then(function(user) {
        $scope.user = user;
    });

    $scope.toggleProfile = function() {
        $scope.showProfile = $scope.showProfile ? false : true;
    }
});

app.factory('AccountFactory', function($http, $q) {
    return {
        getUser : function(user_id) {
            $http.get('/api/user/' + user_id).then(function(response) {
                return response.body;
            }).catch(function(error) {
                console.log(error);
                $q.reject({ message : "Not able to retrieve user"});
            })
        }
    };
});