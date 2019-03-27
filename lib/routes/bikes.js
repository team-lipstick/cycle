const router = require('express').Router();
const Bike = require('../models/bike');
const { respond } = require('./route-helpers');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureSelf = require('../util/ensure-self')();

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `no bike with id ${id}`
});

module.exports = router

    .post('/', ensureAuth, (req, res, next) => {
        Bike.create(req.body)
            .then(bike => res.json(bike))
            .catch(next);
    })
    
    // #1 Don't mix and match styles of route handling. Use `respond` across all
    // routes or don't use it at all

    // #2 These are all one get route
    .get('/models', respond(() => Bike.findByModel()))

    .get('/manufacturers', respond(() => Bike.findByManufacturer()))

    .get('/types', respond(() => Bike.findByType()))

    .get('/years', respond(() => Bike.findByYear()))

    .get('/:id', (req, res, next) => {
        Bike.findById(req.params.id)
            .lean()
            .select('-__v')
            .populate('owner', 'name')
            .then(bike => {
                if(!bike) {
                    throw make404(req.params.id);
                } else {
                    res.json(bike);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Bike.find(req.query)
            .lean()
            .select('manufacturer model year price')
            .populate('owner', 'name')
            .then(bikes => res.json(bikes))
            .catch(next);
    })

    .put('/:id', ensureAuth, ensureSelf, (req, res, next) => {
        Bike.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(bike => res.json(bike))
            .catch(next);
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        Bike.findById(req.params.id)
            .lean()
            .then(bike => {
                if(!bike) {
                    return { removed: false };
                }
                // this check actually works!
                else if(bike.owner.toString() === req.user.id) {
                    return bike
                        .remove()
                        .then(() => ({ removed: true }));
                } else {
                    throw new HttpError({
                        code: 403,
                        message: 'Invalid user'
                    });
                }
            })
            .then(removed => res.json(removed))
            .catch(next);
    });
