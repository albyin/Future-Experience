app.directive('orderPanel', function($rootScope, CartFactory, AuthService, $state) {
    return {
        restrict : 'E',
        templateUrl : 'js/account/directives/orderPanel/order-panel.html',
        scope : {
            order : '='
        },

        link : function(scope, element, attr) {
            scope.showEdit = false;
            scope.buttonText = "Show Edit Order";
            scope.orderProfile = {
                _id : scope.order._id,
                status : scope.order.status
            };

            scope.editToggle = function() {
                scope.showEdit = scope.showEdit ? false : true;
                scope.buttonText = scope.showEdit ? "Hide Edit Order" : "Show Edit Order";
            };

            scope.updateOrder = function(order) {
                CartFactory.updateOrder(order)
                    .then(function(updatedOrder) {
                        scope.order.status = scope.orderProfile.status = updatedOrder.status;
                        scope.editToggle();
                    });
            };
        }
    };
});