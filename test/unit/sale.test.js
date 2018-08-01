const { assert } = require('chai');
const { getErrors } = require('./helper');
const Sale = require('../../lib/models/sale');
const { Types } = require('mongoose');

describe('Sale model', () => {

    it('validates good model', () => {
        const data = {
            bike: Types.ObjectId(),
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

    it('validates sold field', () => {
        const data = {
            bike: Types.ObjectId() 
        };
        
        const sale = new Sale(data);
        assert.strictEqual(sale.sold, false);
    });
});
