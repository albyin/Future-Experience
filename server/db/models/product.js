'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new mongoose.Schema({
    name : String,
    picture: String,
    details: String
});

mongoose.model('Product', ProductSchema);