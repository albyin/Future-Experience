'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var ProductSchema = new mongoose.Schema({
    name : String,
    picture: String,
    details: String
});

//The model now has a findOrCreate static method
ProductSchema.plugin(findOrCreate);

mongoose.model('Product', ProductSchema);