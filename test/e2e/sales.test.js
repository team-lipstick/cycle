const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request, makeSimple } = require('./request');

let exampleSale;
// eslint-disable-next-line
let exampleSaleTwo;
let exampleBike;
let exampleBikeTwo;
let exampleUserOne;
let exampleUserTwo;
let exampleUserThree;
let token;
let tokenTwo;
// eslint-disable-next-line
let tokenThree;

const userOne = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike'
};

const userTwo = {
    name: 'Mon Goosey',
    email: 'bey@face.com',
    password: 'myFaceIsABike'
};

const userThree = {
    name: 'Cycley Wheelmeister',
    email: 'cycle@cycle.com',
    password: 'cyclecycle'
};

describe.only('Sale API', () => {
    beforeEach(() => {
        dropCollection('users');
        dropCollection('bikes');
        dropCollection('sales');
    });
    
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userOne)
            .then(checkOk)
            .then(({ body }) => {
                exampleUserOne = body.user;
                token = body.token;
            });
    });
    
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userTwo)
            .then(checkOk)
            .then(({ body }) => {
                exampleUserTwo = body.user;
                tokenTwo = body.token;
            });
    });
    
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userThree)
            .then(checkOk)
            .then(({ body }) => {
                exampleUserThree = body.user;
                tokenThree = body.token;
            });
    });
        
    beforeEach(() => {
        return save('bikes',
            {
                manufacturer: 'Pojo',
                model: 'Awesome',
                year: 2015,
                price: 1199,
                speeds: 1,
                type: 'Road',
                owner: exampleUserOne._id
            }, token)
            .then(bike => {
                exampleBike = bike;
            });
    });
        
    beforeEach(() => {
        return save('bikes',
            {
                manufacturer: 'Trek',
                model: 'Emonda',
                year: 2017,
                price: 11299,
                speeds: 11,
                type: 'Road',
                owner: exampleUserTwo._id
            }, tokenTwo)
            .then(bike => {
                exampleBikeTwo = bike;
            });
    });
    
    beforeEach(() => {
        return save('sales', 
            {
                bike: exampleBike._id,
                offers: [{
                    contact: exampleUserTwo._id,
                    offer: 50
                }]
            }, token)
            .then(sale => {
                exampleSale = sale;
            });
    });
    
    beforeEach(() => {
        return save('sales', 
            {
                bike: exampleBikeTwo._id,
                offers: [{
                    contact: exampleUserOne._id,
                    offer: 900
                },
                {
                    contact: exampleUserThree._id,
                    offer: 12
                }]
            }, tokenTwo)
            .then(sale => {
                exampleSaleTwo = sale;
            });
    });

    it('saves a sale', () => {
        assert.isOk(exampleSale._id);
    });

    it('gets all sales', () => {
        return request
            .get('/api/sales')
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body[0].offers.length, 1);
            });
    });

    it('gets a sale by id', () => {
        return request
            .get(`/api/sales/${exampleSale._id}`)
            .then(checkOk)
            .then(({ body }) => {
                delete body.bike.owner;
                assert.deepEqual(body, makeSimple(exampleSale, exampleBike));
            });
    });

    it('prevents user from posting sale of bike they don\'t own', () => {
        
    });

    it('deletes a sale', () => {
        return request
            .delete(`/api/sales/${exampleSale._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.strictEqual(body.removed, true);
            })
            .then(() => {
                return request
                    .get('/api/sales')
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.equal(body.length, 1);
                    });
            });
    });

    it('updates sold field and removes sold bike', () => {
        exampleSale.sold = true;
        
        return request
            .put(`/api/sales/${exampleSale._id}`)
            .set('Authorization', token)
            .send(exampleSale)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.sold, true);
            })
            .then(() => {
                return request
                    .get('/api/bikes')
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.deepEqual(body.length, 1);
                    });
            });
    });

    it('adds offer to offers field', () => {
        const data = {
            contact: exampleUserThree._id,
            offer: 200
        };
        return request
            .post(`/api/sales/${exampleSale._id}/offers`)
            .set('Authorization', token)
            .send(data)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.offers.length, 2);
                assert.deepEqual(body.offers[1].offer, 200);
                assert.deepEqual(body.offers[0].contact, exampleUserTwo._id);
            });
    });
});