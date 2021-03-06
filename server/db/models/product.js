'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var ProductSchema = new mongoose.Schema({
    name : String,
    image: { type: String, default: "https://placekitten.com/g/650/650" },
    details: String,
    tags: [String]
});

//The model now has a findOrCreate static method
ProductSchema.plugin(findOrCreate);

mongoose.model('Product', ProductSchema);