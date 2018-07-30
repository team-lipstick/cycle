const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request } = require('./request');

describe.only('Sale API', () => {

    beforeEach(() => dropCollection('sales'));

    let exampleSale;
    const data = {
        bike: '5b47c31caa28598cae793d98',
        seller: {
            user: '5b47c31caa28598cae793d94',
            askingPrice: 100,
        },
        buyers: [{
            user: '5b47c31caa28598cae793d95',
            offer: 75,
            accepted: false
        },
        {
            user: '5b47c31caa28598cae793d96',
            offer: 95,
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
                console.log('***body', body);
                body.forEach(s => delete s._id);
                delete exampleSale.buyers;
                delete exampleSale.__v;
                delete exampleSale._id;
                
                assert.deepEqual(body, [exampleSale]);
            });
    });

});

