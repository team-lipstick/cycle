const express = require('express');
const app = express();
const morgan = require('morgan');
const { handler, api404 } = require('./util/errors');
require('dotenv').config();

app.use(morgan('dev'));
app.use(express.json());

const auth = require('./routes/auth');
const bikes = require('./routes/bikes');
const sales = require('./routes/sales');
const users = require('./routes/users');

app.use('/api/auth', auth);
app.use('/api/bikes', bikes);
app.use('/api/sales', sales);
app.use('/api/users', users);

app.use('/api', api404);

app.use((req, res) => {
    res.sendStatus(404);
});

app.use(handler);

module.exports = app;