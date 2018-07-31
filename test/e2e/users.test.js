const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

describe.only('Users API', () => {

    beforeEach(() => dropCollection('users'));

    let tokenTwo;
    let userTwo = {
        name: 'Mon Goosey',
        email: 'mongoose@mongeese.com',
        password: 'iAmMongooseHearMeRoar'
    };

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userTwo)
            .then(checkOk)
            .then(({ body }) => {
                tokenTwo = body.token;
                // console.log('** body', body);
                userTwo = body.user;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(tokenTwo);
    });
    

});