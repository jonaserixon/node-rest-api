'use strict';

let router = require("express").Router();

module.exports = function(jwt, UserModel, jwtVerify) {

    router.route('/api/register/')
        .get(function(req, res){
            res.status(200).json( { 
                message: "Send a POST with your username to this URL to register. EXAMPLE: { 'user':'John' }",
                links: [
                    {
                        href: req.url,
                        rel: 'self'
                    },
                    {
                        href: '/api/auth/',
                        rel: 'auth',
                        method: 'GET'
                    },
                ]
            });
        })

        .post(function(req, res) {
            let newUser = new UserModel(req.body);

            newUser.save(function(err, doc) {
                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json( { 
                    message: 'Successfully registered!',
                    links: [
                        {
                            href: '/api/auth/',
                            rel: 'authorize',
                            method: 'GET'
                        }
                    ]
                });
            });
        })

    return router;
}
