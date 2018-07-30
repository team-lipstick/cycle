const { assert } = require('chai');
const { getErrors } = require('./helper');
const Sale = require('../../lib/models/sale');
const { Types } = require('mongoose');

describe('Sale model', () => {

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

        assert.isUndefined(sale.validateSync());
        assert.deepEqual(json, data);
    });

    it('validates required fields', () => {
        const sale = new Sale({});
        const errors = getErrors(sale.validateSync(), 3);
        assert.equal(errors.bike.kind, 'required');
        assert.equal(errors['seller.userName'].kind, 'required');
        assert.equal(errors['seller.askingPrice'].kind, 'required');
    });
});
