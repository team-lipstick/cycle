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
                    next(make404(req.params.id));
                } else {
                    res.json(bike);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Bike.find(req.query)
            .lean()
            .select('-__v')
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
                if(bike.owner.toString() === req.user.id) {
                    Bike.findByIdAndRemove(req.params.id)
                        .lean()
                        .then(bike => res.json({ removed: !!bike }))
                        .catch(next);
                } else {
                    next(new HttpError({
                        code: 403,
                        message: 'Invalid user'
                    }));
                }
            });
    });
