const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const userData = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike'
};

const badPassword = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myBikeIsAFace'
};

const badEmail = {
    name: 'Bikey McBikeface',
    email: 'bk@bkfc.com',
    password: 'myBikeIsAFace'
};

describe('Auth API', () => {
    let token;
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/users/signup')
            .send(userData)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    it('can sign in a user', () => {
        return request
            .post('/api/users/signin')
            .send(userData)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('fails when given wrong password', () => {
        return request
            .post('/api/users/signin')
            .send(badPassword)
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('cannot sign up with same email', () => {
        return request
            .post('/api/users/signup')
            .send(userData)
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });
    });

    it('gives a 404 on bad email signin', () => {
        return request
            .post('/api/users/signin')
            .send(badEmail)
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });
});