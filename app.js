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

function jwtVerify(req, res, next) {
    let header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        let splitHeader = header.split(' ');
        req.token = splitHeader[1];
    } 

    next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
let catches = require('./routes/api/catches')(jwt, CatchModel, UserModel, WebhookModel, jwtVerify); 
let webhooks = require('./routes/api/webhooks')(jwt, WebhookModel, jwtVerify); 
let register = require('./routes/api/register')(jwt, UserModel, jwtVerify); 
let auth = require('./routes/api/auth')(jwt, UserModel, jwtVerify); 


app.use('/', catches);
app.use('/', webhooks);
app.use('/', register);
app.use('/', auth);




//Web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});
