const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    speeds: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Bike', schema);
