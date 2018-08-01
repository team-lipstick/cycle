const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');
// const { checkOk } = request;

const makeSimple = (bike, user) => {
    const simple = {
        _id: bike._id,
        manufacturer: bike.manufacturer,
        model: bike.model,
        year: bike.year,
        price: bike.price,
        speeds: bike.speeds,
        gender: bike.gender,
        type: bike.type
    };

    if(user) {
        simple.owner = {
            _id: user._id,
            name: user.name
        };
    }
    return simple;
};

describe('Bikes API', () => {
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
    });

    it('gets a bike by id', () => {
        return request
            .get(`/api/bikes/${trek._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, makeSimple(trek, user));
            });     
    });
        
    it('gets all bikes', () => {
        return request
            .get('/api/bikes')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimple(trek, user), makeSimple(giant, user)]);
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
});