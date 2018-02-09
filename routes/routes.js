'use strict';

let router = require("express").Router();
let mongoose = require('mongoose');
let TestModel1 = mongoose.model('TestModel1');

router.route('/')
    .get(function (req, res) {
        console.log('tjena');
});

router.route('/tests/')
    .get(function(req, res) {
        TestModel1.find({}, function(err, test) {
            res.json(test);
        })
    })
    .post(function(req, res) {
        let makeTest = new TestModel1(req.body);
        makeTest.save(function(err, test) {
          res.json(test);
        });
    })

module.exports = router;
