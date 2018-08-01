const { assert } = require('chai');
const { request } = require('./request');
const { checkOk } = request;
const { dropCollection } = require('./db');

describe.only('Bike Aggregation', () => {

    beforeEach(() => dropCollection('bikes'));
    beforeEach(() => dropCollection('users'));

    // eslint-disable-next-line
    let token;
    let user;
    
    let bikeyMcBikeface = {
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

    let bike1;
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
            .then(data => bike1 = data);
    });

    let bike2;
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
            .then(data => bike2 = data);
    });
    

    const postModel = model => {
        model.bikeyMcBikeface._id = bikeyMcBikeface._id;
        return request
            .post('/models')
            .set('Authorization', bikeyMcBikeface.token)
            .send(model)
            .then(({ body }) => {
                model = body;
            });
    };

    before(() => postModel(bike1));
    // before(() => postModel(bike2));

    it('Bike Models', () => {
        return request
            .get('/models')
            .then(checkOk)
            .then(({ body }) => {
                // assert.equal(body[0].bike1, 'Emonda');
                // assert.equal(body[1].bike2, 'Fathom');
                assert.deepEqual(body, [bike1, bike2]);
            });
    });
});