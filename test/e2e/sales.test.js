const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request } = require('./request');

let exampleSale;
// eslint-disable-next-line
let exampleSaleTwo;
let exampleBike;
let exampleBikeTwo;
let exampleBikeThree;
let exampleUserOne;
let exampleUserTwo;
let exampleUserThree;
let token;
let tokenTwo;
let tokenThree;

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
        return save('bikes',
            {
                manufacturer: 'Happy',
                model: 'Fastly',
                year: 2010,
                price: 1129,
                speeds: 15,
                type: 'Mountain',
                owner: exampleUserTwo._id
            }, tokenTwo)
            .then(bike => {
                exampleBikeThree = bike;
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
        return request
            .post('/api/sales')
            .set('Authorization', tokenThree)
            .send({
                bike: exampleBikeThree._id,
                offers: []
            })
            .then(res => {
                assert.equal(res.status, 403);
                assert.equal(res.body.error, 'Invalid user');
            });
    });

    it('deletes a sale', () => {
        return request
            .delete(`/api/sales/${exampleSale._id}/${exampleUserOne._id}`)
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

    it('ensures only seller can delete own sale', () => {
        return request
            .delete(`/api/sales/${exampleSale._id}/${exampleUserOne._id}`)
            .set('Authorization', tokenTwo)
            .then(res  => {
                assert.equal(res.body.error, 'Invalid user');
                assert.equal(res.status, 403);
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
                        assert.deepEqual(body.length, 2);
                    });
            });
    });
    
    it('ensures only owner can change sold field of sale', () => {
        exampleSale.sold = true;
        
        return request
            .put(`/api/sales/${exampleSale._id}/${exampleUserOne._id}`)
            .set('Authorization', tokenTwo)
            .send(exampleSale)
            .then(res => {
                assert.equal(res.body.error, 'Invalid user');
                assert.equal(res.status, 403);
            });
    });

    it('adds offer to offers field', () => {
        const data = {
            contact: exampleUserThree._id,
            offer: 200
        };
        return request
            .post(`/api/sales/${exampleSale._id}/offers`)
            .set('Authorization', tokenThree)
            .send(data)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.offers.length, 2);
                assert.deepEqual(body.offers[1].offer, 200);
                assert.deepEqual(body.offers[0].contact, exampleUserTwo._id);
            });
    });

    it('prevents owner from adding offer', () => {
        const data = {
            contact: exampleUserOne._id,
            offer: 200
        };
        return request
            .post(`/api/sales/${exampleSale._id}/offers`)
            .set('Authorization', token)
            .send(data)
            .then(res => {
                assert.equal(res.status, 403);
                assert.equal(res.body.error, 'Invalid user');
            });
    });
});