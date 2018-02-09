'use strict';

let mongoose = require('mongoose');

let testModelSchema1 = mongoose.Schema({
    name: {
        type: String
    },
    body: {
        type: String
    },
    author: {
        type: String,
        required: 'Name of the author'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

let TestModel1 = mongoose.model('TestModel1', testModelSchema1);

module.exports = TestModel1;
