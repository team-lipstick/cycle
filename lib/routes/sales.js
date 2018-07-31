const router = require('express').Router();
const Sale = require('../models/sale');
const { HttpError } = require('../util/errors');

module.exports = router

    .post('/', (req, res, next) => {
        Sale.create(req.body)
            .then(sale => res.json(sale))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Sale.find()
            .lean()
            .select('-__v -buyers')
            // .populate('bike', 'manufacturer')
            // .populate('seller', 'name')
            .then(sale => res.json(sale))
            .catch(next);
    });