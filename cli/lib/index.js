/* eslint no-console: off */
const mongoose = require('mongoose');
const Bike =  require('./models/bike');
mongoose.Promise = global.Promise;
const db = mongoose.connect('mongodb://localhost:27017/cycle', { useNewUrlParser: true });

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

const updateBike = (_id, bike) => {
    Bike.update({ _id }, bike)
        .then(bike => {
            console.info('Bike price has been updated', bike);
            db.close();
        });
};

const removeBike = (_id) => {
    Bike.remove({ _id })
        .then(bike => {
            console.info('Bike has been removed', bike);
            db.close();
        });
};

const listBikes = () => {
    Bike.find()
        .then(bikes => {
            console.info(bikes);
            console.info(`${bikes.length} bikes`);
            db.close();
        });
};

module.exports = {
    addBike,
    findBike,
    updateBike,
    removeBike,
    listBikes
};