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

   cartService.addToCart = function (listitem_id, quantity) {
      var newOrder = {
        listitems : [{
          item : listitem_id,
          quantity : quantity
        }]
      };

      CartFactory.createNewOrder(newOrder).then(function(newOrder) {
          cartService.cart = newOrder;
          console.log(cartService.cart);
      });
   };
      // if addObj.listItem does not exist, push onto array
      // else if addObj.listItem does exit, add 1 to its quantity

   //    var ID = addObj.listItem;
   //    var quant = addObj.quantity;

   //    if (!this.cart.orderID){
   //      CartFactory.createNewOrder(addObj);
   //    }
   //    else {
   //      var index = this.cart.listItems.indexOf({listItem:ID});
   //      if (index > -1){
   //        this.cart.listItems[index].quantity++;
   //      }
   //      else {
   //        this.cart.listItems.push(addObj);
   //      }
   //    }

   //    var thecart = this.cart;
   //    if (this.cart.orderID === null){
   //      console.log("THIS,",this);
   //      CartFactory.createNewOrder(thecart.listItems)
   //        .then(function (result){
   //          console.log("RESULt, ",result);
   //          thecart.orderID = result;
   //        }).catch (function (err){
   //          console.log("ERROR IN CREATENO CONTROLLER",err);
   //        });
   //    }
   //    else {
   //      CartFactory.addToOrder(thecart)
   //        .then(function (result){
   //          thecart.orderID = result;
   //        });
   //    }
   // };

});

app.controller('CartController', function ($scope, AuthService, $state, CartFactory, CartService) {
    $scope.cart = CartService.cart;
});

app.factory('CartFactory', function($http) {
   return {
      createNewOrder : function (newCart){
        //http post request to /order
        return $http.post("/api/order", newCart)
          .then(function (response){
            console.log('post response', response);
            return response.data;
          }).catch (function (err){
            console.log("THERE WAS AN ERROR YA'LL",err);
          });

      },
      addToOrder : function (cart){
        //http put request to /order
        return $http.put("/api/order/" + cart.orderID, cart.listItems)
          .then(function (response){
            return response.data;
          });

      }

   };
});