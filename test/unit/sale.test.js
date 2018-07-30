const { assert } = require('chai');
const { getErrors} = require('./helper');
const Sale = require('../../lib/model/sale');
const { Types } = require('mongoose');

describe.only('Sale model', () => {

    it('validates good model', () => {
        const data = {
            bike: Types.ObjectId(),
            seller: {
                userName: Types.ObjectId(),
                askingPrice: 100,
            },
            buyers: [{
                userName: Types.ObjectId(),
                offer: 75,
                accepted: false
            },
            {
                userName: Types.ObjectId(),
                offer: 95,
                accepted: true
            }],
            sold: {
                userName: Types.ObjectId(),
                price: 95,
                date: new Date()
            }
        };
        const sale = new Sale(data);
        const json = sale.toJSON();
        delete json._id;
        json.buyers.forEach(b => delete b._id);


        assert.deepEqual(json, data);
    });
});
