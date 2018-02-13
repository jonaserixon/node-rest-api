'use strict';

let router = require("express").Router();
let mongoose = require('mongoose');
let CatchModel = mongoose.model('Catch');

module.exports = function(passport) {

    router.route('/')
        .get(function (req, res){
            res.send('<p>To use our API, refer to the http://localhost:8000/api/ resource.</p>');
        })

    router.route('/api/')
        .get(function (req, res){
            res.json( { 
                message: 'Welcome to the api! To get access to unsafe HTTP methods please authenticate through the link below.',
                link: 'http://localhost:8000/auth/github'
            });
        })

    router.route('/api/catches')
        .get(function(req, res) {
            CatchModel.find({}, function(err, doc) {
                if (err) {

                }

                res.json(doc);
            })
        })
        .post(ensureAuthenticated, function(req, res) {
            let makeTest = new CatchModel(req.body);
            makeTest.save(function(err, doc) {
                if (err) {
                    //message
                }

                res.json(doc);
            });
        })


    router.route('/api/catches/:id')
        .get(function (req, res) {
            CatchModel.findById(req.params.id, function (err, doc){
                res.json({ 
                    id: doc.id,
                    user: doc.user,
                    position: doc.position,
                    specie: doc.specie,
                    weigth: doc.weigth,
                    length: doc.length,
                    image_url: doc.image_url,
                    description: doc.description,
                    misc: doc.misc,
                    timestamp: doc.timestamp,
                    links: [
                        {
                            self: 'http://localhost:8000/api/catches/' + doc.id,
                            category: 'http://localhost:8000/api/catches/'
                        }
                    ]
                });
            });
        })

        .put(ensureAuthenticated, function(req, res) {
            CatchModel.findByIdAndUpdate(req.params.id, function(err, doc) {
                if (err) {
                    //error message
                    res.status(400).json(err);
                }

                res.json({ 
                    message: 'Update successful!',
                    user: doc.user,
                    links: [
                        {
                            self: 'http://localhost:8000/api/catches/' + doc.id,
                            category: 'http://localhost:8000/api/catches/'
                        }
                    ]
                });
            });
        })

        .delete(ensureAuthenticated, function(req, res) {
            CatchModel.findByIdAndRemove(req.params.id, function(err) {
                if (err) {
                    //error message
                    res.status(400).json(err);
                }

                res.json({
                    message: 'Delete success!'
                });
            });
        })

    router.get('/auth/github',
        passport.authenticate('github', { session: false }, { scope: [ 'user:email' ] }));

    router.get('/auth/github/callback', 
        passport.authenticate('github', { failureRedirect: '/login' }),
            function(req, res) {
                res.redirect('/');
            }
        );


    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.json({
            message: 'Unauthorized access!'
        })
    }

    return router;
};
