const router = require('express').Router();
const Bike = require('../models/bike');
const User = require('../models/user');
const { HttpError } = require('../util/errors');

// const updateOptions = {
//     new: true,
//     runValidators: true
// };

const make404 = id => new HttpError({
    code: 404,
    message: `no bike with id ${id}`
});

module.exports = router

    .post('/', (req, res, next) => {
        Bike.create(req.body)
            .then(bike => res.json(bike))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Bike.findById(req.params.id)
                .lean()
                .select('-__v'),
            User
                .find({ 'owner': req.params.id })
                .lean()
                .select('name')
        ])
            .then(([bike, user]) => {
                if(!bike) {
                    next(make404(req.params.id));
                } else {
                    bike.owner = user;
                    res.json(user);
                }
            })
            .catch(next);
    });