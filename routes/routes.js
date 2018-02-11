'use strict';

let router = require("express").Router();
let mongoose = require('mongoose');
let CatchModel = mongoose.model('Catch');

router.route('/')
    .get(function (req, res){
        res.send('<p>To use our API, refer to the http://localhost:8000/api/ resource.</p>');
    })

router.route('/api/')
    .get(function (req, res){
        res.json( { message: 'Welcome to the api!' });
    })

router.route('/api/catches')
    .get(function(req, res) {
        CatchModel.find({}, function(err, test) {
            res.json(test);

            console.log(req.query.id);
        })
    })
    .post(function(req, res) {
        let makeTest = new CatchModel(req.body);
        makeTest.save(function(err, test) {
          res.json(test);
          console.log(req.body);
        });
    })


router.route('/api/catches/:catchId')
    .get(function (req, res) {
        CatchModel.findById(req.params.catchId, function (err, doc){
            res.json({ 
                id: doc.catchId,
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
                        self: 'http://localhost:8000/api/catches/' + doc.catchId,
                        delete: 'http://localhost:8000/api/catches/delete/' + doc.catchId,
                    }
                ]
            });
        });

        

    })
    .put(function(req, res) {

    })
    .delete(function(req, res) {

    })


router.route('/api/auth')
    .get(function(req, res) {
        //github login för att få access till api
    })

module.exports = router;
