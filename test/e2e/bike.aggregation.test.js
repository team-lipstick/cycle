const { assert } = require('chai');
const { request } = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

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
                user = body.user;
            });
    });

    beforeEach(() => {
        return saveBike({
            manufacturer: 'Trek',
            model: 'Emonda',
            year: 2017,
            price: 11299,
            speeds: 11,
            gender: 'womans',
            type: 'Road',
            owner: user._id
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
            gender: 'mens',
            type: 'trail',
            owner: user._id
        })
            .then(data => giant = data);
    });

    it('saves a bike', () => {
        assert.isOk(trek._id);
        assert.isOk(giant._id);
    });

        
    it('gets all bike models', () => {
        return request
            .get('/api/bikes/models')
            .then(checkOk)
            .then(({ body }) => {
                console.log(body);
                assert.deepEqual(body, [{
                    _id : 'Fathom',
                    results: 1400
                },
                {
                    _id: 'Emonda',
                    results: 11299
                }]);
            });
    });
});