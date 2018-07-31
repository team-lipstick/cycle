const router = require('express').Router();
const Sale = require('../models/sale');
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

    .put('/:id', (req, res, next) => {
        Sale.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(sale => res.json(sale))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Sale.find()
            .lean()
            .select('-__v')
            .then(sale => {
                res.json(sale);
            })
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