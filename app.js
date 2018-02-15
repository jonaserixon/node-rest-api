'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

let CatchModel = require('./models/catchModel');
let UserModel = require('./models/user');
let WebhookModel = require('./models/webhook');

let app = express();
let port = process.env.PORT || 8000;


//database
require('./config/database').initialize();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
let catches = require('./routes/catches')(jwt); 
let webhooks = require('./routes/webhooks')(jwt); 
app.use('/', catches);
app.use('/', webhooks);



//Web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});
