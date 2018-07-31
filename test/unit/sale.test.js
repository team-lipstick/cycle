const { assert } = require('chai');
const { getErrors } = require('./helper');
const Sale = require('../../lib/models/sale');
const { Types } = require('mongoose');

describe('Sale model', () => {

    it('validates good model', () => {
        const data = {
            bike: Types.ObjectId(),
            // offers: [{
            //     buyer: Types.ObjectId(),
            //     bestOffer: 75,
            //     accepted: false
            // },
            // {
            //     buyer: Types.ObjectId(),
            //     bestOffer: 95,
            //     accepted: true
            // }],
            sold: false
        };
    
        const sale = new Sale(data);
        const json = sale.toJSON();
        delete json._id;
        // json.bike.forEach(b => delete b._id);

        assert.isUndefined(sale.validateSync());
        assert.deepEqual(json, data);
    });

    it('validates required fields', () => {
        const sale = new Sale({});
        const errors = getErrors(sale.validateSync(), 1);
        assert.equal(errors.bike.kind, 'required');
    });

    it.skip('validates sold field', () => {
        const data = {
            bike: Types.ObjectId()
            // seller: {
            //     user: Types.ObjectId(),
            //     askingPrice: 100,
            // },
            // offers: [{
            //     buyer: Types.ObjectId(),
            //     bestOffer: 75,
            //     accepted: false
            // },
            // {
            //     buyer: Types.ObjectId(),
            //     bestOffer: 95,
            //     accepted: true
            // }]
        };
        const sale = new Sale(data);
        assert.isUndefined(sale.sold.user);
        assert.isUndefined(sale.sold.finalPrice);
        assert.isUndefined(sale.sold.date);

        sale.checkIfSold();
        assert.isDefined(sale.sold);
        assert.deepEqual(sale.sold.finalPrice, 95);
    });
});
