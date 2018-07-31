const { assert } = require('chai');
const { request } = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe.only('Bikes API', () => {

    beforeEach(() => dropCollection('bikes'));
    beforeEach(() => dropCollection('users'));

    let trek;
    let token;
    let user;
    
    function saveBike(bike) {
        return request
            .post('/api/bikes')
            .send(bike)
            .then(checkOk)
            .then(({ body }) => body);
                
    }

    const bikeyMcBikeface = {
        name: 'Bikey McBikeface',
        email: 'bikey@bikeface.com',
        password: 'myFaceIsABike',
        
    };

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

    it('saves a bike', () => {
        assert.isOk(trek._id);
    }); 
});