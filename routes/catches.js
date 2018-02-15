'use strict';

let router = require("express").Router();
let mongoose = require('mongoose');
let CatchModel = mongoose.model('Catch');
let UserModel = mongoose.model('User');
let WebhookModel = mongoose.model('Webhook');

let request = require('request');

let jwtVerify = require('../jwt');

module.exports = function(jwt) {

    router.route('/')
        .get(function (req, res){
            res.send('<p>To use our API, refer to the http://localhost:8000/api/ resource.</p>');
        })

    router.route('/api/')
        .get(function (req, res){
            res.json( { 
                message: 'Welcome to the api! To get access to unsafe HTTP methods please authenticate through the link below.',
                link: 'http://localhost:8000/api/auth/'
            });
        })

    //authorize
    router.route('/api/auth/')
        .get(function (req, res){
            res.json( { 
                message: 'Send a POST with your username to this URL to receive token.',
                link: [
                    {
                        href: req.url,
                        rel: 'self'
                    }
                ]
            });
        })
        .post(function(req, res) {
            UserModel.find({'username': req.body.username}, function(err, user) {
                if (err) {
                    return res.sendStatus(403);
                }
                if (!user.length) {
                    //Skapa användaren
                    // let newUser = new UserModel(req.body);
                    // newUser.save(function(err, doc) {
                    //     if (err) {
                    //         //message
                    //     }
                    //     jwt.sign({user: newUser}, 'secret', function(err, token) {
                    //         res.json({
                    //             token: token
                    //         });
                    //     });
                    // });
                    res.json({message: 'User does not exist'});
                } else {
                    jwt.sign({user: user}, 'notverysecret', function(err, token) {
                        res.json({
                            token: token,
                            expiresInMinutes: 1440
                        });
                    });
                }
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
        .post(jwtVerify, function(req, res) {
            jwt.verify(req.token, 'notverysecret', function(err, data) {
                if (err) {
                    res.sendStatus(403);
                }

                WebhookModel.find({}, function(err, data) {

                    for(let i = 0; i < data.length; i++) {
                        console.log(data[i].links[0][0]);

                        request.post(
                            data[i].links[0][0],
                            { json: { key: req.body } },
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    console.log(body)
                                }
                            }
                        );
                    }
                })

                let makeTest = new CatchModel(req.body);
                makeTest.save(function(err, doc) {
                    if (err) {
                        //message
                    }
                    res.json(doc);
                });
            });
        })


    router.route('/api/catches/:id')
        .get(jwtVerify, function (req, res) {
            jwt.verify(req.token, 'notverysecret', function(err, data) {
                if (err) {
                    CatchModel.findById(req.params.id, function (err, doc){
                        res.json({ 
                            user: doc.user,
                            specie: doc.specie,
                            description: doc.description,
                            misc: doc.misc,
                            timestamp: doc.timestamp,
                        });
                    });
                } else {
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
                                    href: req.url,
                                    rel: 'self',
                                    method: 'GET',
                                    category: '/api/catches/'
                                }
                            ]
                        });
                    });
                }
            })
        })

        .put(jwtVerify, function(req, res) {
            jwt.verify(req.token, 'notverysecret', function(err, data) {
                if (err) {
                    //err
                }

                CatchModel.findOne({_id: req.params.id}, function(err, doc) {
                    if (err) {
                        //error message
                        res.status(400).json(err);
                    }

                    console.log(req.body.specie);

                    doc.position = req.body.position,
                    doc.specie = req.body.specie,
                    doc.weigth = req.body.weigth,
                    doc.length = req.body.length
                    doc.image_url = req.body.image_url,
                    doc.description = req.body.description,
                    doc.misc = req.body.misc

                    doc.save(function(err) {
                        if (err) { console.log(err); }
                    })
                    

                    res.json({ 
                        message: 'Update successful!',
                        links: [
                            {
                                href: req.url,
                                rel: 'self',
                                method: 'PUT',
                                category: '/api/catches/'
                            }
                        ]
                    });
                });
            })
        })

        .delete(function(req, res) {
            CatchModel.findByIdAndRemove(req.params.id, function(err) {
                if (err) {
                    //error message
                    res.status(400).json(err);
                }

                res.json({
                    message: 'Delete success!',
                    links: [
                        {
                            href: req.url,
                            rel: 'self',
                            method: 'DELETE',
                            category: '/api/catches/'
                        }
                    ]
                });
            });
        })


    router.route('/webhook/test/')
        .post(function(req, res) {
            console.log('WEBHOOK EVENT');
        })

    return router;
};
