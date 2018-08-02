const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request } = require('./request');

let exampleSale;
let exampleUserOne;
let exampleUserTwo;
let exampleBike;
let token;
let tokenTwo;

const userOne = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike'
};
const userTwo = {
    name: 'Bikey McBikeface',
    email: 'Keybi@bikeface.com',
    password: 'myFaceIsABike'
};

const makeSimple = (sale, bike) => {
    const simple = {
        _id: sale._id,
        offers: sale.offers,
        sold: sale.sold
    };

    if(bike) {
        simple.bike = {
            _id: bike._id,
            manufacturer: bike.manufacturer,
            model: bike.model,
            price: bike.price,
            speeds: bike.speeds,
            type: bike.type,
            year: bike.year
        };
    }
    return simple;
};
const makeSimpleGetAll = (sale, bike) => {
    const simple = {
        _id: sale._id,
        offers: sale.offers,
        sold: sale.sold
    };

    if(bike) {
        simple.bike = {
            _id: bike._id,
            manufacturer: bike.manufacturer,
            model: bike.model,
            price: bike.price
        };
    }
    return simple;
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
        return save('bikes',
            {
                manufacturer: 'Trek',
                model: 'Emonda',
                year: 2017,
                price: 11299,
                speeds: 11,
                gender: 'womans',
                type: 'Road',
                owner: exampleUserOne._id
            }, token)
            .then(bike => {
                exampleBike = bike;
            });
    });
    
    beforeEach(() => {
        return save('sales', 
            {
                bike: exampleBike._id,
                offers: [{
                    email: exampleUserOne._id,
                    offer: 50
                }]
            }, token)
            .then(sale => {
                exampleSale = sale;
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
                delete exampleSale.__v;
                assert.deepEqual(body, [makeSimpleGetAll(exampleSale, exampleBike)]);
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
                        assert.deepEqual(body, []);
                    });
            });
    });

    it('updates sold field and removes sold bike', () => {
        exampleSale.sold = true;
        
        return request
            .put(`/api/sales/${exampleSale._id}/${exampleUserOne._id}`)
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
                        assert.deepEqual(body, []);
                    });
            });
    });
    
    it('ensures only owner can change sold field of sale', () => {
        exampleSale.sold = true;
        
        return request
            .put(`/api/sales/${exampleSale._id}/${exampleUserOne._id}`)
            .set('Authorization', tokenTwo)
            .send(exampleSale)
            // .then(checkOk)
            .then(res => {
                assert.equal(res.body.error, 'Invalid user');
                assert.equal(res.status, 403);
            });
    });

    it('adds offer to offers field', () => {
        const data = {
            email: exampleUserOne._id,
            offer: 200
        };
        return request
            .post(`/api/sales/${exampleSale._id}/offers`)
            .set('Authorization', token)
            .send(data)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.offers.length, 2);
                assert.deepEqual(200, body.offers[1].offer);
                assert.deepEqual(exampleUserOne._id, body.offers[0].email);
            });
    });
});