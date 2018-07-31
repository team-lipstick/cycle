const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    bike: {
        type: Schema.Types.ObjectId,
        ref: 'Bike',
        required: true
    },
    offers: [{
        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        bestOffer: Number,
        accepted: {
            type: Boolean,
            default: false  
        }

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
    return this.offers.forEach(offer => {
        if(offer.accepted === true) {
            this.sold.buyer = offer.buyer;
            this.sold.finalPrice = offer.bestOffer;
            this.sold.date = new Date();  
        }
    });
};

module.exports = mongoose.model('Sale', schema);