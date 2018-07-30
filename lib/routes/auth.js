const router = require('express').Router();
const Authuser = require('../models/auth-user');
const { HttpError } = require('../util/errors');
const tokenService = require('../util/token-service');
const ensureAuth = require('../util/ensure-auth')();

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ veriffied: true });
    })

    .post('/signup', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        Authuser.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use.'
                    });
                }

                const authuser = new Authuser(body);
                authuser.generateHash(password);
                return authuser.save();
            })
            .then(authuser => tokenService.sign(authuser))
            .then(token => res.json({ token }))
            .catch(next);
    })

    .post('/sign', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        Authuser.findOne({ email })
            .then(authuser => {
                if(!authuser || !authuser.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid email or password.'
                    });
                }
                return tokenService.sign(authuser);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });