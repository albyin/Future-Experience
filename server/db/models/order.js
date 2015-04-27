'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Promise = require('bluebird');
var _ = require('lodash');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var orderSchema = new mongoose.Schema({
    // deleted "product" key to be "listitems" for consistency
    listitems : [{
        item : {type: Schema.Types.ObjectId, ref:'ListItem'},
        quantity : {type: Number, default : 0}
    }],
    user           : {type: Schema.Types.ObjectId, ref:'User'},
    createdTime    : { type : Date, default : Date.now },
    modifiedTime   : { type : Date, default : Date.now },
    totalPrice: Number,
   //number refering to 1,2,3,4: 1 - pending, 2 - paid; 3 - shipped; 4 - delivered;
    status: { type : Number, default : 1 }
});

orderSchema.plugin(deepPopulate);
orderSchema.plugin(findOrCreate);

orderSchema.statics.getOrdersByUserId = function(id, cb) {
    return this.find({
        user : id
    }).deepPopulate('user listitems.item  listitems.item.creator listitems.item.product listitems.item.category').exec(cb);
};

orderSchema.statics.getOrdersByOrderId = function(id, cb) {
    return this
        .findById(id)
        .deepPopulate('user listitems.item listitems.item.creator listitems.item.product listitems.item.category').exec(cb);
};

orderSchema.statics.findByIdAndUpdateOrder = function(id, update, cb) {
    return this
        .findById(id, function(err, order) {
            if (err) return cb(err);
            if (!order._id) return new Error("Order Not Found");

            _.keys(update).forEach(function(key) {
                order[key] = update[key];
            });

            order.save(cb);
        });
};

// This pre-save will automatically calculate the totalPrice
orderSchema.pre('save', function (next) {
    var Order = this;
    Order.totalPrice = 0;
    Promise.all(Order.listitems.map(function(eachListItem) {
        return Order.model('ListItem')
            .findByIdAndUpdate(eachListItem.item)
            .exec();
    }))
    .then(function(listItems) {
        if (listItems.length > 0) {
            var quantity;
            listItems.forEach(function (item) {
                quantity = _.find(Order.listitems, function (listItem) {
                    return item.id === listItem.item.toString();
                }).quantity;

                Order.totalPrice += quantity * item.price;
            });
        }

        next();
    }).catch(function(err) {
        next(err);
    });
});



mongoose.model('Order', orderSchema);