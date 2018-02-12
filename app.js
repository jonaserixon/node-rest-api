'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let CatchModel = require('./models/catchModel');


let passport = require('passport');
let GitHubStrategy = require('passport-github2').Strategy;

var GITHUB_CLIENT_ID = '672e1847db6e0d151b27';
var GITHUB_CLIENT_SECRET = 'b1e63aa0c34c7f22bd97ee65bcbe09b992839673';

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback",
    scope: ['user:email']
},

    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));



let app = express();
let port = process.env.PORT || 8000;


//database
require('./config/database').initilize();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

//Routes
let routes = require('./routes/routes')(passport); 
app.use('/', routes);






//Web server
app.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});
