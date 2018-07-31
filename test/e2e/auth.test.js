const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const userOne = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike'
};

const userTwo = {
    name: 'Mon Goosey',
    email: 'mongoose@mongeese.com',
    password: 'iAmMongooseHearMeRoar'
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

let tokenOne;
let tokenTwo;

describe('Auth API', () => {
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userOne)
            .then(checkOk)
            .then(({ body }) => {
                tokenOne = body.token;
            });
    });

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userTwo)
            .then(checkOk)
            .then(({ body }) => {
                tokenTwo = body.token;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(tokenOne);
        assert.isDefined(tokenTwo);
    });

    it('can sign in a user', () => {
        return request
            .post('/api/auth/signin')
            .send(userOne)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('fails when given wrong password', () => {
        return request
            .post('/api/auth/signin')
            .send(badPassword)
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('cannot sign up with same email', () => {
        return request
            .post('/api/auth/signup')
            .send(userOne)
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });
    });

    it('gives a 404 on bad email signin', () => {
        return request
            .post('/api/auth/signin')
            .send(badEmail)
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });
});