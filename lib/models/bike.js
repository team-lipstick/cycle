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
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    speeds: {
        type: Number,
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

schema.statics = {
    findByModel() {
        return this.aggregate([
            { $group : { _id : '$model', price : { $min : '$price' }, available : { $sum : 1 } } }
        ]);
    },

    findByManufacturer() {
        return this.aggregate([
            { $group : { _id : '$manufacturer', model : { $min : '$model' } } }
        ]);
    },
    
    findByType() {
        return this.aggregate([
            { $group : { _id : '$type', model : { $min : '$model' }, price : { $min : '$price' } } }
        ]);
    },

    findByYear() {
        return this.aggregate([
            { $group : { _id : '$year', model : { $min : '$model' }, price : { $min : '$price' } },  }
        ]);
    }
};

module.exports = mongoose.model('Bike', schema);
