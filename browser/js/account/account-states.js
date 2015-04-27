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