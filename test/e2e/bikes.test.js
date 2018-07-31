const { assert } = require('chai');
const { request } = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

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
            .send(bike)
            .then(checkOk)
            .then(({ body }) => body);    
    }

    beforeEach(() => {
        return request
            .post('/api/users/signup')
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
                assert.deepEqual(body, trek);
            });
            
    });
        
    it('gets all bikes', () => {
        return request
            .get('/api/bikes')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [trek, giant]);
            });
    });
        
    it('updates a bike', () => {
        trek.price = 10000;
        return request  
            .put(`/api/bikes/${trek._id}`)
            .send(trek)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.price, 10000);
            });
    });
        
    it('deletes a bike', () => {
        return request
            .delete(`/api/bikes/${giant._id}`)
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