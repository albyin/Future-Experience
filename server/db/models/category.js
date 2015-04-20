'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new mongoose.Schema({
    name : String
});

mongoose.model('Category', CategorySchema);