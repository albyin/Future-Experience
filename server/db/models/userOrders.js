'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema = mongoose.Schema;

var userOrdersSchema = new mongoose.Schema({
    user : {type: Schema.Types.ObjectId, ref:'User'},
    order : {type: Schema.Types.ObjectId, ref:'Order'}
});

userOrdersSchema.plugin(deepPopulate);

var userIdFilter = function(userOrder, filterOption) {
    return userOrder.user.id === filterOption.user_id;
};

userOrdersSchema.statics.searchOrder = function(filterOption, cb) {
    var queryObj = {};

    if ((filterOption.user_id && filterOption.order_id)) {
        return this.find({
            user : filterOption.user_id,
            order : filterOption.order_id
        })
        .deepPopulate('order user order.listitems order.listitems.product order.listitems.category')
        .exec(cb);
    }

    // go through the filter Option and create new query object
    this.find({})
        .deepPopulate('order user order.listitems order.listitems.product order.listitems.category')
        .exec(function(err, userOrders) {
            if (err) return cb(err);

            userOrders = userOrders.filter(function(order) {
                if (filterOption.user_id) {
                    return userIdFilter(order, filterOption);
                }
                return true;
            });

            cb(null, userOrders);
        });
};

mongoose.model('UserOrders', userOrdersSchema);


//var findOrCreate = require('mongoose-findorcreate');
//
//var cartSchema = new mongoose.Schema({
//    user : {type: Schema.Types.ObjectId, ref:'User', select : false},
//    listitem : {type: Schema.Types.ObjectId, ref:'ListItem'},
//    chosenQuantity : Number
//});
//
//cartSchema.plugin(deepPopulate);
//cartSchema.plugin(findOrCreate);
//
//var userIdFilter = function(userOrder, filterOption) {
//    return userOrder.user.id === filterOption.user_id;
//};
//
//cartSchema.statics.searchCart = function(filterOption, cb) {
//    var queryObj = {};
//
//    if ((filterOption.user_id && filterOption.cart_id)) {
//        return this.find({
//            user : filterOption.user_id,
//            _id : filterOption.cart_id
//        })
//            .deepPopulate('listitem listitem.product listitem.category')
//            .exec(cb);
//    }
//
//    // go through the filter Option and create new query object
//    return this.find({user : filterOption.user_id})
//        .deepPopulate('listitem listitem.product listitem.category')
//        .exec(cb);
//};
//
//mongoose.model('Cart', cartSchema);