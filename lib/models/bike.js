const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');


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

schema.statics = {

    findModels() {
        return this.aggregate([
            { $group : { _id : '$model', results : { $min : '$price' } } }
        ]);
    }
};

schema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password, 8);
};

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

module.exports = mongoose.model('Bike', schema);
