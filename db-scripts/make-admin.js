require('dotenv').config();
const connect = require('../lib/util/connect');
const User = require('../lib/models/user');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cycle';
connect(MONGODB_URI);

User.findByIdAndUpdate(
    '',
    {
        $addToSet: {
            roles: 'admin'
        }
    }
)
    .catch(console.log)
    .then(() => mongoose.connection.close());