'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

let Catch = require('./models/catchModel');
let User = require('./models/user');
let Webhook = require('./models/webhook');

let mongoose = require('mongoose');
let CatchModel = mongoose.model('Catch');
let UserModel = mongoose.model('User');
let WebhookModel = mongoose.model('Webhook');


let app = express();
let port = process.env.PORT || 8000;


//database
require('./config/database').initialize();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
let catches = require('./routes/catches')(jwt, CatchModel, UserModel, WebhookModel); 
let webhooks = require('./routes/webhooks')(jwt, WebhookModel); 
app.use('/', catches);
app.use('/', webhooks);


//Web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});
