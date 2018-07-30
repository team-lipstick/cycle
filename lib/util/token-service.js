const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const APP_SECRET = 'mongodb://localhost:27017/cycle';

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            roles: user.roles
        };
        return sign(payload, APP_SECRET);
    },
    verify(token) {
        return verify(token, APP_SECRET);
    }
};