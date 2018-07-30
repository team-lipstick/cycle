const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    bike: {
        type: Schema.Types.ObjectId,
        ref: 'Bike',
        required: true
    },
    seller: {
        userName: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        askingPrice: {
            type: Number,
            required: true
        },
    },
    buyers: [{
        userName: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        offer: Number,
        accepted: Boolean
    }],
    sold: {
        userName: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        price: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }
});

module.exports = mongoose.model('Sale', schema);