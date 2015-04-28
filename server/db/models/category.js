'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var CategorySchema = new mongoose.Schema({
    name : String,
    description : String
});

CategorySchema.plugin(findOrCreate);
mongoose.model('Category', CategorySchema);