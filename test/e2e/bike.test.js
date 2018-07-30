const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe.only('Bikes API', () => {

    beforeEach(() => {
        dropCollection('bikes');
        dropCollection('users');
    });

    let bikeyMcBikeface;
    let trek;
    
    function saveBike(bike) {
        return request
            .post('/api/bikes')
            .send(bike)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveUser(user) {
        return request
            .post('/api/users')
            .send(user)
            .then(checkOk)
            .then(({ body }) => body);

    }

    beforeEach(() => {
        return saveBike({
            manufacturer: 'Trek',
            model: 'Emonda',
            year: 2017,
            price: 11299,
            speeds: 11,
            gender: 'womans',
            type: 'Road',
            owner: bikeyMcBikeface._id
        })
            .then(data => trek = data);
    });

    beforeEach(() => {
        return saveUser({
            name: 'Bikey McBikeface',
            email: 'bikey@bikeface.com',
            hash: 'abc123',
        })
            .then(data => bikeyMcBikeface = data);
    });
    
    it('saves a film', () => {
        assert.isOk(trek._id);
    });
});