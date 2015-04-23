'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var ListItemSchema = new mongoose.Schema({
    quantity : Number,
    price    : Number,
    product: {type : Schema.Types.ObjectId, ref : 'Product'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'}
});

var generalFilter = function(listItems, matchStr) {
	var regex = new RegExp(matchStr, 'i');
	return listItems.filter(function(item) {
		return item.category.name.match(regex) || item.product.name.match(regex)
	});
};

ListItemSchema.statics.searchList = function(filterOption, cb){
	var queryObj = {};
	
	// go through the filter Option and create new query object
	this.find({})
	.populate('product category')
	.exec(function(err, listItems) {
		if (err) return cb(err);

		if (filterOption.general) {
			listItems = generalFilter(listItems, filterOption.general);
		}

		cb(null, listItems);
	});
};

ListItemSchema.plugin(findOrCreate);
mongoose.model('ListItem', ListItemSchema); 