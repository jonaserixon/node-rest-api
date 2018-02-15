'use strict';

let mongoose = require('mongoose');

let webhookSchema = mongoose.Schema({
    links: [
        {
            type: Array
        }
    ]
});

let Webhook = mongoose.model('Webhook', webhookSchema);

module.exports = Webhook;