const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    bike: {
        type: Schema.Types.ObjectId,
        ref: 'Bike',
        required: true
    },
    sold: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Sale', schema);