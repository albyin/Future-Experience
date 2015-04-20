'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
    products : [{type: Schema.Types.ObjectId, ref:'ListItem'}],
    time    : Date,
    totalPrice: Number,
   //number refering to 1,2,3,4: 1 - pending, 2 - paid; 3 - shipped; 4 - delivered;
    status: Number
});

mongoose.model('Order', orderSchema);