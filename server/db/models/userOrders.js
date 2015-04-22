'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userOrdersSchema = new mongoose.Schema({
    user : [{type: Schema.Types.ObjectId, ref:'User'}],
    order : [{type: Schema.Types.ObjectId, ref:'Order'}]
});

mongoose.model('UserOrders', userOrdersSchema);

var userIdFilter = function(orders, id) {
    return orders.filter(function(order) {
        return order.user.id === id;
    });
};

userOrdersSchema.statics.searchOrder = function(filterOption, cb) {
    var queryObj = {};

    // go through the filter Option and create new query object
    this.find({})
        .populate('order user')
        .exec(function(err, orders) {
            if (err) return cb(err);

            if (filterOption.user_id) {
                orders = userIdFilter(orders, filterOption.user_id);
            }

            cb(null, orders);
        });
};
