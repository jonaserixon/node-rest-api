'use strict';

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
});

let User = mongoose.model('User', userSchema);

module.exports = User;
