const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request, simplify } = require('./request');

let exampleSale;
let exampleUserOne;
let exampleBike;

const userOne = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike'
};

describe('Sale API', () => {
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
            })
            .then(bike => {
                exampleBike = bike;
            });
    });
    
    beforeEach(() => {
        return save('sales', 
            {
                bike: exampleBike._id,
            })
            .then(sale => {
                exampleSale = sale;
            });
    });

    it('saves a sale', () => {
        assert.isOk(exampleSale._id);
    });

    it('gets all sales', () => {
        const sale = { 
            sold: false,
            bike:
             {   _id: exampleBike._id,
                 model: 'Emonda',
                 price: 11299 } 
        };
        return request
            .get('/api/sales')
            .then(checkOk)
            .then(({ body }) => {
                body.forEach(s => delete s._id);
                delete exampleSale.offers;
                delete exampleSale.__v;
                delete exampleSale._id;
                assert.deepEqual(body, [sale]);
            });
    });

    it('gets a sale by id', () => {
        const sale = {
            bike: simplify(exampleBike),
            sold: false
        };
        return request
            .get(`/api/sales/${exampleSale._id}`)
            .then(checkOk)
            .then(({ body }) => {
                delete body._id;
                assert.deepEqual(body, sale);
            });
    });

    it('deletes a sale', () => {
        return request
            .delete(`/api/sales/${exampleSale._id}`)
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
            .put(`/api/sales/${exampleSale._id}`)
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

});