// const { assert } = require('chai');
// const Bike = require ('../../lib/models/bike');

// describe.only('CLI Bike model', () => {

//     it('validates a good model', () => {
//         const data = {
//             manufacturer: 'Trek',
//             model: 'Emonda',
//             year: 2017,
//             price: 11299,
//             speeds: 11,
//             gender: 'Womans',
//             type: 'Road',
//         };

//         const bike = new Bike(data);
//         const json = bike.toJSON();
//         delete json._id;
//         delete json.owner._id;
//         assert.deepEqual(json, data);
//     });

// });