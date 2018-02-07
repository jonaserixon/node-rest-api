'use strict';

let router = require("express").Router();

router.route('/')
    .get(function (req, res) {
        console.log('tjena');
});

module.exports = router;