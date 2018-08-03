const router = require('express').Router();
const User = require('../models/user');
const Bike = require('../models/bike');
const Sale = require('../models/sale');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureSelf = require('../util/ensure-self')();

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});

module.exports = router

    .get('/', (req, res, next) => {
        User.find()
            .lean()
            .then(users => res.json(users))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .then(user => {
                if(!user) next(make404(req.params.id));
                else res.json(user);
            })
            .catch(next);
    })
    .get('/:id/bikes', (req, res, next) => {
        Bike.find({ owner: req.params.id })
            .lean()
            .select('-__v -owner')
            .then(bikes => {
                if(!bikes) next(make404(req.params.id));
                else res.json(bikes);
            })
            .catch(next);
    })

    .get('/:id/sales', (req, res, next) => {
        Bike.find({ owner: req.params.id })
            .lean()
            .select('-__v')
            .populate('owner', 'name')
            .then(bikes => {
                return bikes.map(b => b._id);
            })
            .then(bikeIds => {
                return Sale.find({ bike: { $in: bikeIds } })
                    .lean()
                    .select('-__v')
                    .populate('offers.contact', 'name email -_id')
                    .populate({
                        path: 'bike',
                        select: 'manufacturer model price' 
                    });
            })
            .then(sales => {
                if(!sales) next(make404(req.params.id));
                else res.json(sales);
            })       
            .catch(next);
    })

    .put('/:id', ensureAuth, ensureSelf, (req, res, next) => {
        User.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(user => res.json(user))
            .catch(next);       
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .then(user => {
                if(user._id.toString() === req.user.id) {
                    User.findByIdAndRemove(req.params.id)
                        .lean()
                        .then(user => res.json({ removed: !!user }))
                        .catch(next);
                } else {
                    next(new HttpError({
                        code: 403,
                        message: 'Cannot delete a user other than yourself'
                    }));
                }
            });
    });