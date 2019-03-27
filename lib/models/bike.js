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
    // this should be in sale
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
            // why $min price? Wouldn't $min, $avg, $max be better?
            { $group : { 
                _id : '$model', 
                minPrice : { $min : '$price' }, 
                avgPrice : { $avg : '$price' }, 
                maxPrice : { $max : '$price' }, 
                available : { $sum : 1 } 
            } }
        ]);
    },

    findByManufacturer() {
        return this.aggregate([
            { $group : { 
                _id : '$manufacturer', 
                // this doesn't make a lot of sense
                // model : { $min : '$model' }, 
                available : { $sum : 1 } 
            } }
        ]);
    },
    
    findByType() {
        return this.aggregate([
            // $min, $avg, $max
            { $group : { _id : '$type', price : { $min : '$price' }, available : { $sum : 1 } } }
        ]);
    },

    findByYear() {
        return this.aggregate([
            // $min, $avg, $max
            { $group : { _id : '$year', price : { $min : '$price' }, available : { $sum : 1 } }  }
        ]);
    }
};

module.exports = mongoose.model('Bike', schema);
