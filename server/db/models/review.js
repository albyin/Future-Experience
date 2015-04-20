'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new mongoose.Schema({
    userID : {type : Schema.Types.ObjectId, ref : 'User'},
    productID : {type : Schema.Types.ObjectId, ref : 'Product'},
    comment : String,
    stars : Number
});

mongoose.model('Review', ReviewSchema);