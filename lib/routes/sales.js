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

    // no enforcement that I own the bike I'm trying to sell :(
    .post('/', ensureAuth, (req, res, next) => {
        Bike.findById(req.body.bike)
            .lean()
            .select('owner')
            .then(bike => {
                if(!bike) {
                    throw err // need custom error for no bike
                }
                if(bike.owner.toString() === req.user.id) {
                    return Sale.create(req.body);
                } else {
                    throw new HttpError({
                        code: 403,
                        message: 'Invalid user'
                    });
                }
            })
            .then(sale => res.json(sale))
            // do not forget catch!
            .catch(next);
    })
    //updates sold field in 'sales' and deletes bike

    // Only authoratative source of callers user id is req.user.id
    .put('/:id', ensureAuth, (req, res, next) => {
        let sale = {};
        Sale.findOneAndUpdate(
            {
                _id: req.params.id,
                // put the user id in sale...
                seller: req.user.id
            },
            req.body,
            updateOptions
        )
            // Only use of "put" is to finish sale?
            .then(s => {
                sale = s;
                // generaly, don't remove things, mark them sold or deleted
                return Bike.findByIdAndRemove(s.bike);
            })
            .then(() => {
                res.json(sale);
            })
            .catch(next);
    })
    // adds offers
    .post('/:saleId/offers', ensureAuth, (req, res, next) => {
        Sale.findById(req.params.saleId)
            .lean()
            .then(sale => {
                Bike.findById(sale.bike)
                    .select('owner')
                    .lean()
            })
            .then(bike => {
                if(!bike) {
                    // handle this case
                }
                if(bike.owner.toString() !== req.user.id) {
                    return Sale.findByIdAndUpdate(
                        req.params.saleId,
                        {
                            $push: { offers: req.body }
                        },
                        updateOptions
                    );
                } else {
                    throw new HttpError({
                        code: 403,
                        message: 'Invalid user'
                    });
                }
            })
            .then(sale => {
                if(!sale) throw make404(req.params.id);
                
                res.json(sale.offers[sale.offers[0]]);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Sale.find()
            .lean()
            .select('-__v')
            .populate('bike', 'manufacturer model price')
            .populate('offers.contact', 'name email -_id')
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
                select: 'manufacturer model price owner',
                // you can nest populates
                populate: {
                    path: 'owner',
                    select: 'name'
                }
            })
            .then(sale => {
                if(!sale) throw make404(req.params.id);
                res.json(sale);
            })
            .catch(next);
    })

    // is this needed?
    .delete('/:id/:userId', ensureAuth, ensureSeller, (req, res, next) => {
        Sale.findByIdAndRemove(req.params.id)
            .then(sale => res.json({ removed: !!sale }))
            .catch(next);
    });