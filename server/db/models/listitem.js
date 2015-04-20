'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListItemSchema = new mongoose.Schema({
    quantity : Number,
    price    : Number,
    productID: {type : Schema.Types.ObjectId, ref : 'Product'}
});

mongoose.model('ListItem', ListItemSchema);