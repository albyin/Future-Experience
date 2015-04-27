app.config(function ($stateProvider) {

    $stateProvider
        .state('user', {
            abstract : true,
            templateUrl : 'js/account/user.html',
            controller: 'AccountController',
            data : {
                authenticate: true
            }
        })
        .state('user.member', {
            url         : '^/my-account',
            templateUrl : 'js/account/member.html',
            data : {
                authenticate : true
            }
        })
        .state('user.admin', {
            url         : '^/admin',
            templateUrl : 'js/account/admin.html',
            data : {
                authenticate : true,
                admin : true
            }
        })
        .state('user.member.profile', {
            url         : '/profile',
            templateUrl : 'js/account/partials/member-profile.html',
            data : {
                authenticate : true
            }
        })
        .state('user.member.orders', {
            url         : '/orders',
            templateUrl : 'js/account/partials/member-order.html',
            data : {
                authenticate : true
            }
        })
        .state('user.admin.users', {
            url         : '/users',
            templateUrl : 'js/account/partials/admin-user.html',
            data : {
                authenticate : true,
                admin : true
            }
        })
        .state('user.admin.orders', {
            url         : '/orders',
            templateUrl : 'js/account/partials/admin-orders.html',
            data : {
                authenticate : true,
                admin : true
            }
        })
        .state('user.admin.products', {
            url        : '/products',
            templateUrl: 'js/account/partials/admin-products.html',
            data : {
                authenticate : true,
                admin        : true
            }
        })
        .state('user.admin.listitems', {
            url        : '/products',
            templateUrl: 'js/account/partials/admin-listitems.html',
            data : {
                authenticate : true,
                admin        : true
            }
        });
});

app.controller('AccountController', function($scope, Upload, AuthService, AccountFactory, CartFactory, ProductFactory, ListItemFactory, $state) {
    $scope.listitems = $scope.products = $scope.allUsers = $scope.user = $scope.orders = null;

    var emptyProfileInput = function() {
        $scope.profile = {
            firstName: null,
            lastName: null,
            email: null
        };
    };

    // Loading user
    $scope.loadUser = function() {
        AuthService.getLoggedInUser().then(function(user) {
            $scope.user = user;
            Object.keys(user).forEach(function(key) {
                $scope.profile[key] = user[key];
            });
        });
    };

    // load orders
    $scope.loadOrders = function(user_id) {
        CartFactory
            .getUserOrders(user_id)
            .then(function(orders) {
                $scope.orders = orders;
                console.log($scope.orders);
            });
    };

    // get all users
    $scope.loadAllUsers = function() {
        AccountFactory.getUsers().then(function(users) {
            $scope.allUsers = users;
        });
    };

    // get products
    $scope.getAllProducts = function() {
        ProductFactory.getAllProducts().then(function(products) {
            $scope.products = products;
        });
    };

    $scope.uploadFile = function (files) {
        console.log(files);
    };

    // get listitems
    $scope.loadListItems = function() {
        ListItemFactory.getListItems().then(function(listitems) {
            $scope.listitems = listitems;
        });
    };



    emptyProfileInput();
});

app.factory('AccountFactory', function($http, $q) {
    return {
        getUsers : function(user_id) {
            user_id = user_id || '';
            return $http.get('/api/user/' + user_id).then(returnResponse).catch(function(error) {
                console.log(error);
                $q.reject({ message : "Not able to retrieve user"});
            });
        },
        updateUser : function(user_id, updateObj) {
            return $http
                .put('/api/user/' + user_id, updateObj)
                .then(returnResponse).catch(function(error) {
                    console.log(error);
                    $q.reject({ message : "Not able to update user"});
                });
        }
    };
});