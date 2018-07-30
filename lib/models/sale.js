const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    bike: {
        type: Schema.Types.ObjectId,
        ref: 'Bike',
        required: true
    },
    seller: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        askingPrice: {
            type: Number,
            required: true
        },
    },
    buyers: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        offer: Number,
        accepted: Boolean
    }],
    sold: {
        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        finalPrice: Number,
        date: {
            type: Date
        }
    }
});

schema.methods.checkIfSold = function() {
    return this.buyers.forEach(buyer => {
        if(buyer.accepted === true) {
            this.sold.buyer = buyer.user;
            this.sold.finalPrice = buyer.offer;
            this.sold.date = new Date();  
        }
    });
};

module.exports = mongoose.model('Sale', schema);