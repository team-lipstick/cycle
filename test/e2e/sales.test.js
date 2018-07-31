const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request, addOffer, simplify } = require('./request');

let exampleSale;
let exampleUserOne;
let exampleUserTwo;
let exampleUserThree;
let exampleBike;

const userOne = {
    name: 'Bikey McBikeface',
    email: 'bikey@bikeface.com',
    password: 'myFaceIsABike'
};

const userTwo = {
    name: 'Mon Goosey',
    email: 'mongoose@mongeese.com',
    password: 'iAmMongooseHearMeRoar'
};

const userThree = {
    name: 'Goosey Mon',
    email: 'goosemon@mongeese.com',
    password: 'iAmMongooseHearMeRoar'
};

describe('Sale API', () => {
    
    beforeEach(() => {
        dropCollection('sales');
        dropCollection('bikes');
        dropCollection('users');
    });
    
    beforeEach(() => {
        return request
            .post('/api/users/signup')
            .send(userOne)
            .then(checkOk)
            .then(({ body }) => {
                exampleUserOne = body.user;
                // console.log(exampleUserOne);
            });
    });

    beforeEach(() => {
        return request
            .post('/api/users/signup')
            .send(userTwo)
            .then(checkOk)
            .then(({ body }) => {
                exampleUserTwo = body.user;
            });
    });

    beforeEach(() => {
        return request
            .post('/api/users/signup')
            .send(userThree)
            .then(checkOk)
            .then(({ body }) => {
                exampleUserThree = body.user;
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
                seller: {
                    user: exampleUserOne._id,
                    askingPrice: 100,
                },
                offers: [{
                    buyer: exampleUserTwo._id,
                    bestOffer: 75,
                },
                {
                    buyer: exampleUserThree._id,
                    bestOffer: 95,
                    accepted: true
                }]
            })
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
                body.forEach(s => delete s._id);
                delete exampleSale.offers;
                delete exampleSale.__v;
                delete exampleSale._id;
                
                assert.deepEqual(body, [exampleSale]);
            });
    });

    it('gets a sale by id', () => {
        const sale = {
            bike: simplify(exampleBike),
            seller: {
                user: simplify(exampleUserOne),
                askingPrice: 100,
            },
            offers: [{
                buyer: simplify(exampleUserTwo),
                bestOffer: 75,
                accepted: false
            },
            {
                buyer: simplify(exampleUserThree),
                bestOffer: 95,
                accepted: true
            }]
        };
        return request
            .get(`/api/sales/${exampleSale._id}`)
            .then(checkOk)
            .then(({ body }) => {
                body.offers.forEach(o => {
                    delete o._id;
                });
                delete body._id;
                assert.deepEqual(body, sale);
            });
    });

    it('add offer to sale', () => {
        const offer = {
            buyer: '5b47c31caa28598cae793d95',
            bestOffer: 90
        };
        return addOffer(exampleSale._id, offer)
            .then(offer => {
                assert.isDefined(offer._id);
            })
            .then(() => {
                return request.get(`/api/sales/${exampleSale._id}`)
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.equal(body.offers.length, 3);
                        // console.log('***offers***', body.offers);
                    });           
            });
    });

});