app.config(function ($stateProvider) {
    $stateProvider
        .state('cart', {
            url : '/cart',
            templateUrl : 'js/cart/cart.html',
            controller: 'CartController',
            controllerAs : 'CartCtrl'
        });
});

app.controller('CartController', function ($scope, AuthService, $state, CartFactory) {
    $scope.cart = CartFactory.getCart();

    $scope.clearCart = function() {
        CartFactory.clearCart();
    };

    $scope.removeItem = function(item_id) {
        CartFactory.removeItem(item_id);
    };
});

app.factory('CartFactory', function($http, $localStorage) {
    var cart = $localStorage.$default({
        listitems : [],
        totalPrice  : 0
    });

    function pushCartItem(listItem, quantity) {
        if (!quantity) return;
        cart.listitems.push({
            item : listItem,
            quantity : parseInt(quantity)
        });
        cart.totalPrice += listItem.price * quantity;

        console.log(cart);
    }

    function removeItem(id) {
        console.log("here");
        cart.listitems = cart.listitems.filter(function(cartItem) {
            if (cartItem.item._id === id) {
                cart.totalPrice -= cartItem.item.price * cartItem.quantity;
                return false;
            }

            return true;
        });
    }

    function clearCart() {
        cart.$reset({
            listitems : [],
            totalPrice  : 0
        });
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