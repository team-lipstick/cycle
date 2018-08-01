const Cycle = require('./cycle');
const request = require('superagent');
const API_URL = 'mongodb://localhost:27017/cycle';

// eslint-disable-next-line
let token = '';

const bike = {
    signup(credentials) {
        return request
            .post(`${API_URL}/auth/signup`)
            .send(credentials)
            .then(({ body }) => {
                token = body.token;
                return body;
            });
    },
    signin(credentials) {
        return request
            .post(`${API_URL}/auth/signin`)
            .send(credentials)
            .then(({ body }) => {
                token = body.token;
                return body;
            });
    },
};

const cycle = new Cycle(bike);
cycle.start();