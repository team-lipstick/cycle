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
    postBike() {
        return request
            .post(`${API_URL}/bikes`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },
    getBike() {
        return request
            .get(`${API_URL}/bikes`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },
    updateBike() {
        return request
            .put(`${API_URL}/bikes`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },
    deleteBike() {
        return request
            .del(`${API_URL}/bikes`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },
};

const cycle = new Cycle(bike);
cycle.start();