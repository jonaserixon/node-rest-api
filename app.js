'use strict';

let express = require('express');
let bodyParser = require('body-parser');

let app = express();
let port = process.env.PORT || 8000;

//database
require('./config/database').initilize();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
let routes = require('./routes/routes'); 
app.use('/', routes);


//Web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});