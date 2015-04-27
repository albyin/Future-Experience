app.config(function ($stateProvider) {
    $stateProvider
        .state('cart', {
            url : '/cart',
            templateUrl : 'js/cart-refactor/cart.html',
            controller: 'CartController',
            controllerAs : 'CartCtrl'
        });
});

app.controller('CartController', function ($scope, AuthService, $state, CartFactory) {
    $scope.cart = CartFactory.getCart();
});

app.factory('CartFactory', function($http, $q) {

    var cart = {
        listitems : [],
        totalPrice : 0
    };

    function pushCartItem(listItem, quantity) {
        cart.listitems.push({
            item : listItem,
            quantity : parseInt(quantity)
        });
        console.log(listItem);
        cart.totalPrice += listItem.price * quantity;
    }

    function removeItem() {

    }

    function clearCart() {
        cart.listitems = [];
    }

    function getCart() {
        return cart;
    }

    function createNewOrder(newCart) {
        console.log('CREATE NEW ORDER WITH:', newCart);
        return $http.post("/api/order", newCart)
            .then(returnResponse);
    }

    function updateOrder(order) {
        return $http.put("/api/order/" + order._id, order)
            .then(returnResponse);
    }

    function getUserOrders(user_id) {
        var api_url = user_id ? '/api/order/user/' + user_id : '/api/order';
        return $http
            .get(api_url)
            .then(returnResponse);
    }

    return {
        pushCartItem   : pushCartItem,
        removeItem     : removeItem,
        clearCart      : clearCart,
        getCart        : getCart,
        createNewOrder : createNewOrder,
        updateOrder    : updateOrder,
        getUserOrders  : getUserOrders
    };
});