'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var CategorySchema = new mongoose.Schema({
    name : String,
    description : String,
    image : {type : String, default: "https://placekitten.com/g/800/600"}
});

CategorySchema.plugin(findOrCreate);
mongoose.model('Category', CategorySchema);