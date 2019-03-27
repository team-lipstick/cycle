const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    bike: {
        type: Schema.Types.ObjectId,
        ref: 'Bike',
        required: true
    },
    // include the user directly as "seller"
    offers: [{
        contact: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        offer: {
            type: Number,
            required: true,
            min: 1
        } 
    }],
    sold: {
        type: Boolean,
        default: false
    },

});

module.exports = mongoose.model('Sale', schema);

