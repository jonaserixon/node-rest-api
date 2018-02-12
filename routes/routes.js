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
        CatchModel.find({}, function(err, doc) {
            if (err) {

            }

            res.json(doc);
        })
    })
    .post(function(req, res) {
        let makeTest = new CatchModel(req.body);
        makeTest.save(function(err, doc) {
            if (err) {

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
    
    .put(function(req, res) {
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

    .delete(function(req, res) {
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


router.route('/api/auth')
    .get(function(req, res) {
        //github login för att få access till api
    })

module.exports = router;
