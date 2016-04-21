'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    status: String,
    role: String,
    shippingAddress: String,
    billingAddress: String,
    //hash created from password
    created_at: {type: Date, default: Date.now}
});

mongoose.model('User', userSchema);