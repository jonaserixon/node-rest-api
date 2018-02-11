'use strict';

let router = require("express").Router();
let mongoose = require('mongoose');
let TestModel1 = mongoose.model('TestModel1');

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
        TestModel1.find({}, function(err, test) {
            res.json(test);

            console.log(req.query.id);
        })
    })
    .post(function(req, res) {
        let makeTest = new TestModel1(req.body);
        makeTest.save(function(err, test) {
          res.json(test);
          console.log(req.body);
        });
    })


router.route('/api/catches/:catchId')
    .get(function (req, res) {
        res.json({ 
            message: 'This is information regarding this specific catch', 
            id: req.params.catchId,
            links: [
                {
                    self: 'http://localhost:8000/api/catches/' + req.params.catchId,
                    delete: 'http://localhost:8000/api/catches/delete/' + req.params.catchId,
                }
            ]
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
