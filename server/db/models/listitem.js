'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListItemSchema = new mongoose.Schema({
    quantity : Number,
    price    : Number,
    product: {type : Schema.Types.ObjectId, ref : 'Product'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'}
});


ListItemSchema.statics.searchList = function(filterOption, cb){
	var queryObj = {};
	// go through the filter Option and create new query object
	return this.find(queryObj).populate('product category').exec(cb);
}

mongoose.model('ListItem', ListItemSchema);