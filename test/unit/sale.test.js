const { assert } = require('chai');
const { getErrors } = require('./helper');
const Sale = require('../../lib/models/sale');
const { Types } = require('mongoose');

describe.only('Sale model', () => {

    it('validates good model', () => {
        const data = {
            bike: Types.ObjectId(),
            offers: [{
                email:  Types.ObjectId(),
                offer: 100
            }],
            sold: false
        };
    
        const sale = new Sale(data);
        const json = sale.toJSON();
        delete json._id;
        json.offers.forEach(o => delete o._id);

        assert.isUndefined(sale.validateSync());
        assert.deepEqual(json, data);
    });

    it('validates required fields', () => {
        const sale = new Sale({});
        const errors = getErrors(sale.validateSync(), 1);
        assert.equal(errors.bike.kind, 'required');
    });

    it('validates sold field', () => {
        const data = {
            bike: Types.ObjectId() 
        };
        
        const sale = new Sale(data);
        assert.strictEqual(sale.sold, false);
    });

    it('test for min offer amount required', () => {
        const data = {
            bike: Types.ObjectId(),
            offers: [{
                email:  Types.ObjectId(),
                offer: 0
            }]
        };

        const sale = new Sale(data);
        const errors = getErrors(sale.validateSync(), 1);
        assert.equal(errors['offers.0.offer'].kind, 'min');
    });
});
