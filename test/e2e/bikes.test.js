const { assert } = require('chai');
const { request, save, checkOk } = require('./request');
const { dropCollection } = require('./db');
const tokenService = require('../../lib/util/token-service');

const makeSimpleById = (bike, user) => {
    const simple = {
        _id: bike._id,
        manufacturer: bike.manufacturer,
        model: bike.model,
        year: bike.year,
        price: bike.price,
        speeds: bike.speeds,
        type: bike.type
    };

    if(user) {
        simple.owner = {
            _id: user.id,
            name: 'Bikey McBikeface'
        };
    }
    return simple;
};
const makeSimpleForGetAll = (bike, user) => {
    const simple = {
        _id: bike._id,
        manufacturer: bike.manufacturer,
        model: bike.model,
        year: bike.year,
        price: bike.price,
    };

    if(user) {
        simple.owner = {
            _id: user.id,
            name: 'Bikey McBikeface'
        };
    }
    return simple;
};

let trek;
let giant;
// eslint-disable-next-line
let token;
let user;
let tokenTwo;
// eslint-disable-next-line
let userTwo;

const bikeyMcBikeface = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike',
};

const monGoosey = {
    name: 'Mon Goosey',
    email: 'goose@geese.com',
    password: 'WeAreMongoose'
};

describe('Bikes API', () => {
    beforeEach(() => dropCollection('bikes'));
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(bikeyMcBikeface)
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
            .send(monGoosey)
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
            owner: user.id
        }, token)
            .then(data => trek = data);
    });

    beforeEach(() => {
        return save('bikes', {
            manufacturer: 'Giant',
            model: 'Fathom',
            year: 2016,
            price: 1400,
            speeds: 21,
            type: 'trail',
            owner: user.id
        }, token)
            .then(data => giant = data);
    });
    
    it('saves a bike', () => {
        assert.isOk(trek._id);
    });

    it('gets a bike by id', () => {
        return request
            .get(`/api/bikes/${trek._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, makeSimpleById(trek, user));
            });     
    });
        
    it('gets all bikes', () => {
        return request
            .get('/api/bikes')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimpleForGetAll(trek, user), makeSimpleForGetAll(giant, user)]);
            });
    });
     
    it('updates a bike', () => {
        trek.price = 10000;
        return request  
            .put(`/api/bikes/${trek._id}`)
            .set('Authorization', token)
            .send(trek)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.price, 10000);
            });
    });

    it('prevents user from updating someone else\'s bike', () => {
        trek.price = 5000;
        return request
            .put(`/api/bikes/${trek._id}`)
            .set('Authorization', tokenTwo)
            .then(res => {
                assert.equal(res.status, 403);
                assert.equal(res.body.error, 'Invalid user');
            });
    });
        
    it('deletes a bike', () => {
        return request
            .delete(`/api/bikes/${giant._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/bikes');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.length, 1);
            });    
    });

    it('prevents user from deleting someone else\'s bike', () => {
        return request
            .delete(`/api/bikes/${giant._id}`)
            .set('Authorization', tokenTwo)
            .then(res => {
                assert.equal(res.status, 403);
                assert.equal(res.body.error, 'Invalid user');
            });
    });
});