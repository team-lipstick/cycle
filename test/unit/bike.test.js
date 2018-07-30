const { assert } = require('chai');
const { getErrors } = require('./helper');
const { Types } = require('mongoose');
const Bike = require ('../../lib/models/bike');

describe('Bike model', () => {

    it('validates a good model', () => {
        const data = {
            manufacturer: 'Trek',
            model: 'Emonda',
            year: 2017,
            price: 11299,
            speeds: 11,
            gender: 'Womans',
            type: 'Road',
            owner: Types.ObjectId()
        };

        const bike = new Bike(data);

        const json = bike.toJSON();
        delete json._id;
        delete json.owner._id;
        assert.deepEqual(json, data);
    });

    it('validates all required fields', () => {
        const bike = new Bike({});
        const errors = getErrors(bike.validateSync(), 8);
        assert.equal(errors.manufacturer.kind, 'required');
        assert.equal(errors.model.kind, 'required');
        assert.equal(errors.year.kind, 'required');
        assert.equal(errors.price.kind, 'required');
        assert.equal(errors.speeds.kind, 'required');
        assert.equal(errors.gender.kind, 'required');
        assert.equal(errors.type.kind, 'required');
        assert.equal(errors.owner.kind, 'required');
    });
});