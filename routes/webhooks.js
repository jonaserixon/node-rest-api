'use strict';

let router = require("express").Router();
let jwtVerify = require('../jwt');

module.exports = function(jwt, WebhookModel) {

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
                message: "To create a webhook, make a POST to this route and state your URL. EXAMPLE: { 'links':'http://localhost:8000' }",
                link: [
                    {
                        href: req.url,
                        rel: 'self',
                        method: 'GET'
                    },
                    {
                        href: '/api/catches/',
                        rel: 'resource',
                        method: 'GET'
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