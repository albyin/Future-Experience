'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
    line1: String,
    line2: String,
    city: String,
    country: String,
    postalCode: Number
});

var userSchema = new mongoose.Schema({
    firstName : {type : String, required : true},
    lastName : {type : String, required: true},
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    //used in routes later to display or not display certain properties
        select : false
    },
    salt: {
        type: String,
        select: false
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    address: [addressSchema],
    userType: {
        type: String
    }
});


// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

var searchUser = function(user_id, cb){
    if(!user_id.length) return this.find({}).exec(cb);

    return this.findById(user_id).exec(cb);
};

userSchema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

userSchema.statics.generateSalt = generateSalt;
userSchema.statics.encryptPassword = encryptPassword;

userSchema.statics.searchUser = searchUser;

userSchema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', userSchema);