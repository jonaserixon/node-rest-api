'use strict';

module.exports = function jwtVerify(req, res, next) {
    let header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        let splitHeader = header.split(' ');
        req.token = splitHeader[1];
        next();
    } else {
        //res.json({message: 'Forbidden'})
        next();
    }
}