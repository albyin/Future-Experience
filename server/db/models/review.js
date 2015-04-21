'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new mongoose.Schema({
    user : {type : Schema.Types.ObjectId, ref : 'User'},
    product : {type : Schema.Types.ObjectId, ref : 'Product'},
    comment : String,
    stars : Number
});

mongoose.model('Review', ReviewSchema);