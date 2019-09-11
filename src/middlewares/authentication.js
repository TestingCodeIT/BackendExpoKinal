'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var pass = 'super_ultra_mega_top_secrete_password';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) return res.status(403).send({ message: 'Request has no authorization header' });

    var token = req.headers.authorization.replace(/['"']+/g);

    try {
        var payload = jwt.decode(token, pass);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token has expired' });
        }
    } catch (ex) {
        return res.status(404).send({ message: 'Invalid token' });
    }

    req.user = payload;
    next();
}
