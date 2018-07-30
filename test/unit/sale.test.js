const { assert } = require('chai');
const errors = require
const Sale = require('../../lib/model/sale');
const { Types } = require('mongoose');

describe('Sale model', () => {

    it('validates good sales model', () => {
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
            sold: 
        };
        const sale = new Sale(data);
        const json = sale.toJSON();

        assert.deepEqual(json, data);
    });
});
