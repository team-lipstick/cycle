const { assert } = require('chai');
const { request, checkOk, save } = require('./request');
const { dropCollection } = require('./db');
const tokenService = require('../../lib/util/token-service');

const saleSimple = (sale, bike) => {
    const simple = {};
    simple._id = sale._id;
    simple.bike = {
        _id: bike._id,
        manufacturer: bike.manufacturer,
        model: bike.model,
        price: bike.price
    };
    simple.offers = sale.offers;
    simple.sold = sale.sold;

    return simple;
};

let token;
let user;
let trek;
let giant;
let exampleSale;
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
    beforeEach(() => {
        dropCollection('users');
        dropCollection('bikes');
        dropCollection('sales');
    });

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(monGoosey)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                tokenService.verify(token)
                    .then(userBody => user = userBody);
            });
    });

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(bikey)
            .then(checkOk)
            .then(({ body }) => {
                tokenTwo = body.token;
                tokenService.verify(tokenTwo)
                    .then(userBody => userTwo = userBody);
            });
    });

    beforeEach(() => {
        return save('bikes', {
            manufacturer: 'Trek',
            model: 'Emonda',
            year: 2017,
            price: 11299,
            speeds: 11,
            type: 'Road',
            owner: userTwo.id
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
            type: 'trail',
            owner: userTwo.id
        }, token)
            .then(bike => giant = bike);      
    });
    
    beforeEach(() => {
        return save('sales', 
            {
                bike: trek._id,
            }, tokenTwo)
            .then(sale => {
                exampleSale = sale;
            });
    });
        
    it('signs up a user', () => {
        assert.isDefined(token);
    });
        
    it('signs in a user', () => {
        assert.isOk(user.id);
    });
        
    it('gets a list of users', () => {
        return request 
            .get('/api/users')
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.length, 2);
            });
    });
        
    it('gets a user by id', () => {
        return request
            .get(`/api/users/${user.id}`)
            .then(checkOk)
            .then(({ body }) => {
                user = body;
                assert.deepEqual(body, user);
            });
    });

    it('it gets all bikes owned by user', () => {
        delete trek.owner;
        delete trek.__v;
        delete giant.owner;
        delete giant.__v;
        return request
            .get(`/api/users/${userTwo.id}/bikes`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [trek, giant]);
            });
    });

    it('it gets all sales owned by user', () => {
        return request
            .get(`/api/users/${userTwo.id}/sales`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [saleSimple(exampleSale, trek)]);
            });
    });
        
    it('updates a user', () => {
        return request
            .put(`/api/users/${user.id}`)
            .set('Authorization', token)
            .send({
                _id: user.id,
                name: 'Mon Goosey',
                email: 'hello@mongeese.com',
                password: 'iAmMongooseHearMeRoar'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.email, 'hello@mongeese.com');
            });
    });
    
    it('prevents user from updating a different user', () => {
        user.email = 'gooseymon@geese.com';
        return request
            .put(`/api/users/${user.id}`)
            .set('Authorization', tokenTwo)
            .then(res => {
                assert.equal(res.status, 403);
                assert.equal(res.body.error, 'Invalid user');
            });
    });
    
    it('deletes a user', () => {
        return request  
            .delete(`/api/users/${user.id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request
                    .get('/api/users');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.length, 1);
            });
    });
});