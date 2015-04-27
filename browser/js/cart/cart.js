app.config(function ($stateProvider) {
    $stateProvider
        .state('cart', {
            url : '/cart',
            templateUrl : 'js/cart/cart.html',
            controller: 'CartController',
            controllerAs : 'CartCtrl'
        });
});

app.service('CartService', function($rootScope, CartFactory) {
    var cartService = this;
   cartService.cart = null;

   // cartService.addToCart = function (listitem_id, quantity) {
      //var newOrder = {
      //  listitems : [{
      //    item : listitem_id,
      //    quantity : quantity
      //  }]
      //};
      //
      //CartFactory.createNewOrder(newOrder).then(function(newOrder) {
      //    cartService.cart = newOrder;
      //    console.log(cartService.cart);
      //});
   // };
});

app.controller('CartController', function ($scope, AuthService, $state, CartFactory, CartService) {
    $scope.cart = CartService.cart;
});

app.factory('CartFactory', function($http, $q) {
   return {
      createNewOrder : function (newCart){
        //http post request to /order
        console.log('CREATE NEW ORDER WITH:', newCart);
        return $http.post("/api/order", newCart)
          .then(function (response){
            console.log('post response', response);
            return response.data;
          }).catch (function (err){
            console.log("THERE WAS AN ERROR YA'LL",err);
          });

      },
      updateOrder : function (order){
        //http put request to /order
        return $http.put("/api/order/" + order._id, order)
          .then(function (response){
            return response.data;
          });

      },
       getUserOrders : function(user_id) {
           var api_url = user_id ? '/api/order/user/' + user_id : '/api/order';
           return $http
               .get(api_url)
               .then(returnResponse)
               .catch(function(error) {
                   console.log(error);
                   $q.reject({ message : "Not able to update user"});
               });
       }

   };
});