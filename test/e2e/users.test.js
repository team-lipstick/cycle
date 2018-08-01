const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

describe('Users API', () => {
    beforeEach(() => dropCollection('users'));

    let tokenTwo;
    let mongoosey;
    let userTwo = {
        name: 'Mon Goosey',
        email: 'mongoose@mongeese.com',
        password: 'iAmMongooseHearMeRoar'
    };
    // authenticated user
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
                
                assert.deepEqual(body, [mongoosey]);
            });
    });
        
    it('gets a user by id', () => {
        return request
            .get(`/api/users/${mongoosey._id}`)
            .then(checkOk)
            .then(({ body }) => {
                mongoosey = body;
                assert.deepEqual(body, mongoosey);
            });
    });
        
    it('updates a user', () => {
        mongoosey.email = 'mongoose666@mongeese.com';
        return request
            .put(`/api/users/${mongoosey._id}`)
            .set('Authorization', tokenTwo)
            .send(mongoosey)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.email, mongoosey.email);
            });
    });
    
    xit('deletes a user', () => {
        return request  
            .delete(`/api/users/${mongoosey._id}`)
            .set('Authorization', tokenTwo)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed:true });
                return request
                    .get('/api/users');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, []);
            });
    });
});