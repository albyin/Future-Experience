'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListItemSchema = new mongoose.Schema({
    quantity : Number,
    price    : Number,
    product: {type : Schema.Types.ObjectId, ref : 'Product'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'}
});

mongoose.model('ListItem', ListItemSchema);