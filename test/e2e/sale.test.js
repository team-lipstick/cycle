const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request, addOffer } = require('./request');

describe.only('Sale API', () => {

    beforeEach(() => dropCollection('sales'));

    let exampleSale;
    const data = {
        bike: '5b47c31caa28598cae793d98',
        seller: {
            user: '5b47c31caa28598cae793d94',
            askingPrice: 100,
        },
        offers: [{
            user: '5b47c31caa28598cae793d95',
            bestOffer: 75,
        },
        {
            user: '5b47c31caa28598cae793d96',
            bestOffer: 95,
            accepted: true
        }]
    };
        
    beforeEach(() => {
        return save('sales', data)
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
                // console.log('***body', body);
                body.forEach(s => delete s._id);
                delete exampleSale.offers;
                delete exampleSale.__v;
                delete exampleSale._id;
                
                assert.deepEqual(body, [exampleSale]);
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