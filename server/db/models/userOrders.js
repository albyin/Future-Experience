'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userOrdersSchema = new mongoose.Schema({
    userId : [{type: Schema.Types.ObjectId, ref:'User'}],
    orderId : [{type: Schema.Types.ObjectId, ref:'Order'}]
});

mongoose.model('UserOrders', userOrdersSchema);
