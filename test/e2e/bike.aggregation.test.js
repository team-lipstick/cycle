const { assert } = require('chai');
const { request } = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const tokenService = require('../../lib/util/token-service');

describe('Bikes Aggregation API', () => {
    beforeEach(() => dropCollection('bikes'));
    beforeEach(() => dropCollection('users'));

    let trek;
    let giant;
    // eslint-disable-next-line
    let token;
    let user;
    
    const bikeyMcBikeface = {
        name: 'Bikey McBikeface',
        email: 'bikey@bikeface.com',
        password: 'myFaceIsABike',
    };
    
    function saveBike(bike) {
        return request
            .post('/api/bikes')
            .set('Authorization', token)
            .send(bike)
            .then(checkOk)
            .then(({ body }) => body);    
    }

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(bikeyMcBikeface)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                tokenService.verify(token)
                    .then(body => user = body);
            });
    });

    beforeEach(() => {
        return saveBike({
            manufacturer: 'Trek',
            model: 'Emonda',
            year: 2017,
            price: 11299,
            speeds: 11,
            type: 'road',
            owner: user.id
        })
            .then(data => trek = data);
    });

    beforeEach(() => {
        return saveBike({
            manufacturer: 'Giant',
            model: 'Fathom',
            year: 2016,
            price: 1400,
            speeds: 21,
            type: 'trail',
            owner: user.id
        })
            .then(data => giant = data);
    });

    it('saves a bike', () => {
        assert.isOk(trek._id);
        assert.isOk(giant._id);
    });

        
    it('gets bikes by models with price and number available', () => {
        return request
            .get('/api/bikes/models')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    _id : 'Fathom',
                    available: 1,
                    price: 1400
                },
                {
                    _id: 'Emonda',
                    available: 1,
                    price: 11299
                }]);
            });
    });

    it('gets bikes by manufacturers with model and number available', () => {
        return request
            .get('/api/bikes/manufacturers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    _id : 'Giant',
                    available: 1,
                    model: 'Fathom'
                },
                {
                    _id: 'Trek',
                    available: 1,
                    model: 'Emonda'
                }]);
            });
    });
    
    it('gets bikes by type with model, price, and number available', () => {
        return request
            .get('/api/bikes/types')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    _id : 'trail',
                    available: 1,
                    model: 'Fathom',
                    price: 1400
                },
                {
                    _id: 'road',
                    available: 1,
                    model: 'Emonda',
                    price: 11299
                }]);
            });
    });

    it('gets bikes by year with model, price, and number available', () => {
        return request
            .get('/api/bikes/years')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    _id : 2016,
                    available: 1,
                    model: 'Fathom',
                    price: 1400
                },
                {
                    _id: 2017,
                    available: 1,
                    model: 'Emonda',
                    price: 11299
                }]);
            });
    });
});