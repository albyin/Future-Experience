'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userOrdersSchema = new mongoose.Schema({
    user : [{type: Schema.Types.ObjectId, ref:'User'}],
    order : [{type: Schema.Types.ObjectId, ref:'Order'}]
});

mongoose.model('UserOrders', userOrdersSchema);
