'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');


var ReviewSchema = new mongoose.Schema({
    user : String,
    product : {type : Schema.Types.ObjectId, ref : 'Product'},
    comment : String,
    stars : Number
});

ReviewSchema.plugin(findOrCreate);
mongoose.model('Review', ReviewSchema);