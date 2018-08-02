const { assert } = require('chai');
const { request, checkOk, save } = require('./request');
const { dropCollection } = require('./db');

let token;
let user;
let trek;
let giant;

// eslint-disable-next-line
let tokenTwo;
let userTwo;

const monGoosey = {
    name: 'Mon Goosey',
    email: 'mongoose@mongeese.com',
    password: 'iAmMongooseHearMeRoar'
};

const bikey = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike',
};


describe('Users API', () => {
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('bikes'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(monGoosey)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                user = body.user;
            });
    });

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(bikey)
            .then(checkOk)
            .then(({ body }) => {
                tokenTwo = body.token;
                userTwo = body.user;
            });
    });

    beforeEach(() => {
        return save('bikes', {
            manufacturer: 'Trek',
            model: 'Emonda',
            year: 2017,
            price: 11299,
            speeds: 11,
            gender: 'womans',
            type: 'Road',
            owner: userTwo._id
        }, token)
            .then(bike => trek = bike);
    });

    beforeEach(() => {
        return save('bikes', {
            manufacturer: 'Giant',
            model: 'Fathom',
            year: 2016,
            price: 1400,
            speeds: 21,
            gender: 'mens',
            type: 'trail',
            owner: userTwo._id
        }, token)
            .then(bike => giant = bike);      
    });
        
    it('signs up a user', () => {
        assert.isDefined(token);
    });
        
    it('signs in a user', () => {
        assert.isOk(user._id);
    });
        
    it('gets a list of users', () => {
        return request 
            .get('/api/users')
            .then(checkOk)
            .then(({ body }) => {
                
                assert.deepEqual(body, [user, userTwo]);
            });
    });
        
    it('gets a user by id', () => {
        return request
            .get(`/api/users/${user._id}`)
            .then(checkOk)
            .then(({ body }) => {
                user = body;
                assert.deepEqual(body, user);
            });
    });

    it('it gets all bikes owned by user', () => {
        return request
            .get(`/api/users/${userTwo._id}/bikes`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [trek, giant]);     
            });
    });
        
    it('updates a user', () => {
        user.email = 'mongoose666@mongeese.com';
        return request
            .put(`/api/users/${user._id}`)
            .set('Authorization', token)
            .send(user)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.email, user.email);
            });
    });
    
    it('prevents user from updating a different user', () => {
        user.email = 'gooseymon@geese.com';
        return request
            .put(`/api/users/${user._id}`)
            .set('Authorization', tokenTwo)
            .then(res => {
                assert.equal(res.status, 403);
                assert.equal(res.body.error, 'Invalid user');
            });
    });
    
    it('deletes a user', () => {
        return request  
            .delete(`/api/users/${user._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request
                    .get('/api/users');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [userTwo]);
            });
    });

});