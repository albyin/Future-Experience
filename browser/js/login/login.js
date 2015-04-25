app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login?redirect',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, $stateParams) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            if ($stateParams.redirect) {
                $state.go($stateParams.redirect);
            } else {
                $state.go('home');
            }
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});