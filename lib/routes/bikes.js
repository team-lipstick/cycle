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
       
        Bike.findById(req.params.id)
            .lean()          
            // .populate('owner', 'name')
            // User
            //     .find({ 'owner': req.params.id })
            //     .lean()
            //     .select('name')
        
            .then(bike => {
                if(!bike) {
                    next(make404(req.params.id));
                } else {
                    res.json(bike);
                }
            })
            .catch(next);
    });