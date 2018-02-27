'use strict';

let router = require("express").Router();

module.exports = function(jwt, WebhookModel, jwtVerify) {

    router.route('/api/webhook/')
        .get(jwtVerify, function (req, res) {
            jwt.verify(req.token, process.env['JWT_SECRET'], function(err, data) {
                if (err) {
                    res.json({
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
                    })

                } else {
                    WebhookModel.find({}, function(err, data) {
                        if (err) {
                            return res.status(500).json(err);
                        }

                        let obj = {
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
                        }
                        
                        res.json({
                            information: obj,
                            webhooks: data
                        });
                    })
                }
        })

        })
        .post(jwtVerify, function (req, res) {
            jwt.verify(req.token, process.env['JWT_SECRET'], function(err, data) {
                if (err) {
                    return res.sendStatus(401);
                }

                let createWebhook = new WebhookModel(req.body);
                createWebhook.save(function(err, doc) {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: 'Webhook registered'
                    });
                });
            })
        })

    return router;
};