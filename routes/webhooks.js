'use strict';

let router = require("express").Router();
let mongoose = require('mongoose');
let CatchModel = mongoose.model('Catch');
let UserModel = mongoose.model('User');
let WebhookModel = mongoose.model('Webhook');

let jwtVerify = require('../jwt');

module.exports = function(jwt) {

    router.route('/api/webhook/:id')
            .get(function (req, res) {
                jwt.verify(req.token, 'notverysecret', function(err, data) {
                //Show specific webhook
                })
            })

    router.route('/api/webhook/')
        .get(function (req, res) {
            //Documentation
            res.json( { 
                message: 'To create a webhook, make a POST to this route and state what event you want to subscribe to and your URL.',
                link: [
                    {
                        href: req.url,
                        rel: 'self'
                    }
                ]
            });
        })
        .post(jwtVerify, function (req, res) {
            jwt.verify(req.token, 'notverysecret', function(err, data) {
                if (err) {
                    res.sendStatus(403);
                }

                let createWebhook = new WebhookModel(req.body);
                createWebhook.save(function(err, doc) {
                        if (err) {
                            //message
                        }

                        res.json(doc);
                });
            })
        })

    return router;
};