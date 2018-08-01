/* eslint no-console: off */
const mongoose = require('mongoose');
const User =  require('../models/user');
mongoose.Promise = global.Promise;
const db = mongoose.connect('mongodb://localhost:27017/cycle', { useNewUrlParser: true });

const addUser = (user) => {
    User.create(user).then(user => {
        console.info('New User Added', user);
        db.close();
    });
};


module.exports = {
    addUser,
    // findBike,
    // updateBike,
    // removeBike,
    // listBikes
};