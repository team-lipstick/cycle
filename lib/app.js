const express = require('express');
const app = express();
const morgan = require('morgan');
const { handler, api404 } = require('./util/errors');
require('dotenv').config();

app.use(morgan('dev'));
app.use(express.json());

const users = require('./routes/users');
// const bikes = require('./routes/bikes');
// const sales = require('./routes/sales');

app.use('/api/users', users);
// app.use('/api/bikes', bikes);
// app.use('/api/sales', sales);

app.use('/api', api404);

app.use((req, res) => {
    res.sendStatus(404);
});

app.use(handler);