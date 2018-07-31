const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

describe.only('Users API', () => {

    beforeEach(() => dropCollection('users'));

    let tokenTwo;
    let mongoosey;
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
                mongoosey = body.user;
            });
    });
        
    it('signs up a user', () => {
        assert.isDefined(tokenTwo);
    });
        
    it('signs in a user', () => {
        assert.isOk(mongoosey._id);
    });
        
    it('gets a list of users', () => {
        return request 
            .get('/api/users')
            .then(checkOk)
            .then(({ body }) => {
                console.log('** body', body);

                assert.deepEqual(body, [mongoosey]);
            });
    });
    

});