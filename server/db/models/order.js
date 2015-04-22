'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
    // deleted "product" key to be "listitems" for consistency
    listitems : [{type: Schema.Types.ObjectId, ref:'ListItem'}],
    time    : { type : Date, default : Date.now },
    totalPrice: Number,
   //number refering to 1,2,3,4: 1 - pending, 2 - paid; 3 - shipped; 4 - delivered;
    status: Number
});

var userIdFilter = function(orders, id) {
    return orders.filter(function(order) {
        return order.id === id;
    });
};

ListItemSchema.statics.searchOrder = function(filterOption, cb) {
    var queryObj = {};

    // go through the filter Option and create new query object
    this.find({})
        .populate('listitems')
        .exec(function(err, orders) {
            if (err) return cb(err);

            if (filterOption.user_id) {
                orders = userIdFilter(orders, filterOption.user_id);
            }

            cb(null, orders);
        });
};


mongoose.model('Order', orderSchema);