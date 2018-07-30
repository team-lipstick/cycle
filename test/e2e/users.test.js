const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const userData = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike'
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
});