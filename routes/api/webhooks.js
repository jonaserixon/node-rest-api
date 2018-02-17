'use strict';

let router = require("express").Router();

module.exports = function(jwt, WebhookModel, jwtVerify) {

    router.route('/api/webhook/')
        .get(function (req, res) {
            //Documentation
            res.status(200).json( { 
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
                    return res.sendStatus(401);
                }

                let createWebhook = new WebhookModel(req.body);
                createWebhook.save(function(err, doc) {
                        if (err) {
                            return res.status(500).json(err);
                        }

                        res.status(201).json(doc);
                });
            })
        })

    return router;
};