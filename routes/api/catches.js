'use strict';

let router = require("express").Router();
let request = require('request');

let baseUrl = 'http://localhost:8000';

module.exports = function(jwt, CatchModel, UserModel, WebhookModel, jwtVerify) {

    router.route('/')
        .get(function(req, res){
            res.send('<p>To use our API, refer to the http://localhost:8000/api/ route.</p>');
        })

    router.route('/api/')
        .get(function(req, res){
            res.status(200).json({ 
                links: [
                    {
                        href: req.url,
                        rel: 'self',
                        method: 'GET'
                    },
                    {
                        href: '/api/auth/',
                        rel: 'auth',
                        method: 'GET'
                    },
                    {
                        href: '/api/register/',
                        rel: 'register',
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


    router.route('/api/user/:username/')
        .get(function(req, res) {
            CatchModel.find({user: req.params.username}, function(err, doc) {
                res.json(doc);
            })
        })



    router.route('/api/catches')
        .get(function(req, res) {
            CatchModel.find({}, function(err, doc) {
                if (err) {
                    return res.status(500).json(err);
                }

                let data = [];

                for(let i = 0; i < doc.length; i++) {
                    data.push({
                        catch: req.url + doc[i].id
                    });
                }
                
                res.status(200).json({catches: data});
            })
        })

        .post(jwtVerify, function(req, res) {
            jwt.verify(req.token, process.env['JWT_SECRET'], function(err, data) {
                if (err) {
                    return res.sendStatus(401);
                }

                let userCatch = {
                    user: data.user[0].user,
                    position: req.body.position,
                    specie: req.body.specie,
                    length: req.body.length,
                    weigth: req.body.weigth,
                    image_url: req.body.image_url,
                    description: req.body.description,
                    misc: req.body.misc
                }
                
                let createCatch = new CatchModel(userCatch);
                createCatch.save(function(err, doc) {
                    if (err) {
                        if (typeof doc == 'undefined') {
                            return res.status(400).json('You forgot to add all required values!');
                        }

                        return res.sendStatus(500);
                    }

                    WebhookModel.find({}, function(error, data) {
                        if (error) {
                            res.status(500).json(error);
                        }
    
                        for(let i = 0; i < data.length; i++) {
                            request.post(data[i].links[0][0], { json: { key: req.body }},
                                function (error, res, body) {}
                            );
                        }
                    })
    
                    res.status(201).json({
                        catch: userCatch,
                        links: [
                            {
                                href: req.url + doc._id,
                                rel: 'self',
                                method: 'GET',
                            },
                            {
                                href: req.url,
                                rel: 'parent',
                                method: 'GET',
                            },
                        ]
                    });
                });
            });
        })


    router.route('/api/catches/:id')
        .get(jwtVerify, function (req, res) {

            let prevCatch = '';
            let nextCatch = '';

            let prevQuery = CatchModel.find({_id: {$lt: req.params.id}}).sort({_id: -1 }).limit(1).exec()
            .then(function(doc) {
                if (typeof doc[0] != "undefined") {
                    doc = doc[0]._id;
                }

                return doc;
            })

            let nextQuery = CatchModel.find({_id: {$gt: req.params.id}}).sort({_id: 1 }).limit(1).exec()
            .then(function(doc) {
                if (typeof doc[0] != "undefined") {
                    doc = doc[0]._id;
                }

                return doc;
            })

            Promise.all([prevQuery, nextQuery])
            .then(([prevCatch, nextCatch]) => {
                jwt.verify(req.token, process.env['JWT_SECRET'], function(err, data) {
                    if (err) {
                        CatchModel.findById(req.params.id, function (err, doc){
                            if (err) {
                                return res.status(500).json(err);
                            }
    
                            if (!doc) {
                                return res.status(500).json(err);
                            }
    
                            res.status(200).json({ 
                                id: doc.id,
                                position: doc.position,
                                specie: doc.specie,
                                weigth: doc.weigth,
                                length: doc.length,
                                image_url: doc.image_url,
                                description: doc.description,
                                misc: doc.misc,
                            });
                        });
                    } else {
                        CatchModel.findById(req.params.id, function (err, doc){
                            if (err) {
                                return res.status(500).json(err);
                            }
    
                            if (!doc) {
                                return res.status(500).json(err);
                            }
    
                            res.status(200).json({ 
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
                                    },
                                    {
                                        href: req.url,
                                        rel: 'self',
                                        method: 'PUT',
                                    },
                                    {
                                        href: req.url,
                                        rel: 'self',
                                        method: 'DELETE',
                                    }
                                ],
                                navigation: [
                                    {
                                        previous: '/api/catches/' + prevCatch,
                                        next: '/api/catches/' + nextCatch
                                    }
                                ]
                            });
                        });
                    }
                })
            })
        })

        .put(jwtVerify, function(req, res) {
            jwt.verify(req.token, process.env['JWT_SECRET'], function(err, data) {
                if (err) {
                    return res.sendStatus(401);
                }

                CatchModel.findOne({_id: req.params.id}, function(err, doc) {
                    //Kollar så att den inloggade usern bara kan ändra datan på sina catches
                    if (data.user[0].user != doc.user) {
                        return res.status(403).json('access denied when trying to update this resource');
                    }


                    if (err) {
                        return res.status(500).json(err);
                    }

                    doc.position = req.body.position,
                    doc.specie = req.body.specie,
                    doc.weigth = req.body.weigth,
                    doc.length = req.body.length
                    doc.image_url = req.body.image_url,
                    doc.description = req.body.description,
                    doc.misc = req.body.misc

                    doc.save(function(err) {
                        if (err) {
                            return res.status(500).json(err);
                        }
                    })
                    
                    res.status(200).json({
                        message: 'Updated',
                        links: [
                            {
                                href: req.url,
                                rel: 'self',
                                method: 'PUT',
                            },
                            {
                                href: req.url,
                                rel: 'self',
                                method: 'DELETE',
                            },
                            {
                                href: req.url,
                                rel: 'self',
                                method: 'GET',
                            },
                            {
                                href: '/api/catches/',
                                rel: 'resources',
                                method: 'GET',
                            }
                        ]
                    });
                });
            })
        })

        .delete(jwtVerify, function(req, res) {
            jwt.verify(req.token, process.env['JWT_SECRET'], function(err, data) {
                if (err) {
                    return res.sendStatus(401);
                }

                CatchModel.findOne({_id: req.params.id}, function(err, doc) {
                    if (data.user[0].user != doc.user) {
                        return res.status(403).json('access denied when trying to delete this resource');
                    }

                    if (err) {
                        return res.status(500).json(err);
                    }

                    CatchModel.remove(function(err, result) {
                        if (err) {
                            return res.status(500).json(err);
                        }

                        res.status(200).json({
                            message: 'Deleted',
                            links: [
                                {
                                    href: req.url,
                                    rel: 'self',
                                    method: 'DELETE',
                                },
                                {
                                    href: baseUrl + '/api/catches/',
                                    rel: 'resources',
                                    method: 'GET',
                                },
                                {
                                    href: baseUrl + '/api/catches/',
                                    rel: 'create',
                                    method: 'POST',
                                }
                            ]
                        });
                    })
                });
            })
        })

    //Just testing if the webhook event works.
    router.route('/test/')
        .post(function(req, res) {
            //console.log(req.body);
            res.json(req.body);
        })

    return router;
};
