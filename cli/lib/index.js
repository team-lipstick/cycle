const mongoose = require('mongoose');
const Bike =  require('./models/bike');
mongoose.Promise = global.Promise;
const db = mongoose.connect('mongodb://localhost:27017/cycle');

const addBike = (bike) => {
    Bike.create(bike).then(bike => {
        console.info('New Bike Added', bike);
        db.close();
    });
};

const findBike = (name) => {
    const search = new RegExp(name, 'i');
    Bike.find({ $or: [{ manufacturer: search }, { model: search }] })
        .then(bike => {
            console.log(bike);
            console.info(`${bike.length} matches`);
            db.close();
        });
};

module.exports = {
    addBike,
    findBike
};