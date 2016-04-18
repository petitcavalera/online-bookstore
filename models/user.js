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
    shippingAddr: String,
    BillingAddr: String,
    //hash created from password
    created_at: {type: Date, default: Date.now}
});

mongoose.model('User', userSchema);