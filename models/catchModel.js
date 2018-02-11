'use strict';

let mongoose = require('mongoose');

let catchSchema = mongoose.Schema({
    user: {
        type: String
    },
    position: {
        type: String
    },
    specie: {
        type: String
    },
    weight: {
        type: String
    },
    length: {
        type: String
    },
    image_url: {
        type: String
    },
    description: {
        type: String
    },
    misc: {
        type: String
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

let Catch = mongoose.model('Catch', catchSchema);

module.exports = Catch;
