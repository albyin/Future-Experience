'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new mongoose.Schema({
    name : String,
    categoryID: {type : Schema.Types.ObjectId, ref : 'Category'}
});

mongoose.model('Product', ProductSchema);