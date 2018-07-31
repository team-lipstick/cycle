const router = require('express').Router();
const Sale = require('../models/sale');
const Bike = require('../models/bike');
const User = require('../models/user');
const { HttpError } = require('../util/errors');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No sale with id ${id}`
});

module.exports = router

    .post('/', (req, res, next) => {
        Sale.create(req.body)
            .then(sale => res.json(sale))
            .catch(next);
    })

    .post('/:id/offers', (req, res, next) => {
        Sale.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    offers: req.body
                }
            },
            updateOptions
        )
            .then(sale => {
                if(!sale) next(make404(req.params.is));
                else {
                    res.json(sale.offers[sale.offers.length - 1]);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Sale.find()
            .lean()
            .select('-__v -offers')
            .then(sale => res.json(sale))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        let sale = {};
        Sale.findById(req.params.id)
            .lean()
            .select('-__v')
            .populate({
                path: 'bike',
                select: 'model price owner' 
            })
            .populate('offers.buyer', 'name')
            .then(s => {
                sale = s;
                return User.findById(s.bike.owner)
                    .lean()
                    .select('name');
            })
            .then(user => {
                if(!sale) next(make404(req.params.id));
                else {
                    sale.bike.owner = user.name;
                    res.json(sale);
                }
            })
            .catch(next);
    });