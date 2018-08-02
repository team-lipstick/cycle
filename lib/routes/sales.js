const router = require('express').Router();
const Sale = require('../models/sale');
const Bike = require('../models/bike');
const User = require('../models/user');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureSeller = require('../util/ensure-seller')();

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No sale with id ${id}`
});

module.exports = router

    .post('/', ensureAuth, (req, res, next) => {
        Sale.create(req.body)
            .then(sale => res.json(sale))
            .catch(next);
    })
    //updates sold field in 'sales' and deletes bike in 'bikes'
    .put('/:id/:userId', ensureAuth, ensureSeller, (req, res, next) => {
        let sale = {};
        Sale.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(s => {
                sale = s;
                return Bike.findByIdAndRemove(s.bike);
            })
            .then(() => {
                res.json(sale);
            })
            .catch(next);
    })
    // adds offers
    .post('/:saleId/offers', ensureAuth, (req, res, next) => {
        Sale.findByIdAndUpdate(
            req.params.saleId,
            {
                $push: {
                    offers: req.body
                }
            },
            updateOptions
        )
            .then(sale => {
                if(!sale) next(make404(req.params.id));
                else {
                    res.json(sale); 
                }
            })
            .catch(next);
    })
    

    .get('/', (req, res, next) => {
        Sale.find()
            .lean()
            .select('-__v')
            .then(sales => {
                return Bike.populate(sales, { path: 'bike', select: 'manufacturer model price' });  
            })
            .then(sales => {
                res.json(sales);
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
                select: '-__v'
            })
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
    })

    .delete('/:id/:userId', ensureAuth, ensureSeller, (req, res, next) => {
        Sale.findByIdAndRemove(req.params.id)
            .then(sale => res.json({ removed: !!sale }))
            .catch(next);
    });