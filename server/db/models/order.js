'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var orderSchema = new mongoose.Schema({
    // deleted "product" key to be "listitems" for consistency
    listitems : [{type: Schema.Types.ObjectId, ref:'ListItem'}],
    createdTime    : { type : Date, default : Date.now },
    modifiedTime   : { type : Date, default : Date.now },
    totalPrice: Number,
   //number refering to 1,2,3,4: 1 - pending, 2 - paid; 3 - shipped; 4 - delivered;
    status: { type : Number, default : 1 }
});

orderSchema.plugin(findOrCreate);
mongoose.model('Order', orderSchema);