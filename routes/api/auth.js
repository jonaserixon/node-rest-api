'use strict';

let router = require("express").Router();

module.exports = function(jwt, UserModel, jwtVerify) {

    router.route('/api/auth/')
        .get(function (req, res){
            res.status(200).json( { 
                message: 'Send a POST with your username to this URL to receive token.',
                links: [
                    {
                        href: req.url,
                        rel: 'self'
                    }
                ]
            });
        })

        .post(function(req, res) {
            UserModel.find({'user': req.body.user}, function(err, user) {
                if (err) {
                    res.status(500).json(err);
                }

                if (!user.length) {
                    res.sendStatus(404);

                } else {
                    jwt.sign({user: user}, 'notverysecret', function(err, token) {
                        res.status(200).json({
                            token: token,
                            expiresInMinutes: 1440,
                            links: [
                                {
                                    href: '/api/auth/',
                                    rel: 'self',
                                    method: 'POST'
                                },
                                {
                                    href: '/api/catches/',
                                    rel: 'resource',
                                    method: 'GET'
                                },
                                {
                                    href: '/api/webhook/',
                                    rel: 'webhook',
                                    method: 'GET'
                                }
                            ]
                        });
                    });
                }
            }); 
        })
    return router;
}
