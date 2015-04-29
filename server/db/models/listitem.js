'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');
var deepPopulate = require('mongoose-deep-populate');

var ListItemSchema = new mongoose.Schema({
    quantity : Number,
    price    : Number,
    product: {type : Schema.Types.ObjectId, ref : 'Product'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
	creator: {type: Schema.Types.ObjectId, ref: 'User'},
	tags   : {type: [String], default: ['Fullstack Academy']}
});

var generalFilter = function(listItems, general) {
	var regex = new RegExp(general, 'i');

	return listItems.filter(function(item) {
		return item.category.name.match(regex) || item.product.name.match(regex);
	});
};

var advancedFilter = function(listItems, filterOption) {
	var catRegex, prodRegex;
	if (filterOption.category) {
		catRegex = new RegExp(filterOption.category, 'i');
	}

	if (filterOption.product) {
		prodRegex = new RegExp(filterOption.product, 'i');
	}

	var bothTest = false;
	if (catRegex && prodRegex) {
		bothTest = true;
	}

	return listItems.filter(function(item) {
		if (bothTest) {
			return item.category.name.match(catRegex) && item.product.name.match(prodRegex);
		}

		if (catRegex) {
			return item.category.name.match(catRegex);
		}

		if (prodRegex) {
			return item.product.name.match(prodRegex);
		}
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

		if (filterOption.product || filterOption.category) {
			listItems = advancedFilter(listItems, filterOption);
		}

		cb(null, listItems);
	});
};

ListItemSchema.plugin(findOrCreate);
ListItemSchema.plugin(deepPopulate);

mongoose.model('ListItem', ListItemSchema); 