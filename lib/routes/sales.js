const router = require('express').Router();
const Sale = require('../models/sale');
const { HttpError } = require('../util/errors');

module.exports = router

    .post('/', (req, res, next) => {
        Sale.create(req.body)
            .then(sale => res.json(sale))
            .catch(next);
    });