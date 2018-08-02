const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();

const checkOk = res => {
    if(res.status !== 200) throw new Error('expected http 200 status code');
    return res;
};

const simplify = data => {
    const simple = { _id: data._id };
    if(data.name) simple.name = data.name;
    if(data.model) simple.price = data.price;
    if(data.price) simple.model = data.model;
    if(data.owner) simple.owner = 'Bikey McBikeface';    
    return simple;
};

const makeSimple = (sale, bike) => {
    const simple = {
        _id: sale._id,
        offers: sale.offers,
        sold: sale.sold
    };

    if(bike) {
        simple.bike = {
            _id: bike._id,
            manufacturer: bike.manufacturer,
            model: bike.model,
            price: bike.price
        };
    }
    return simple;
};

const save = (path, data, token = null) => {
    return request
        .post(`/api/${path}`)
        .set('Authorization', token)
        .send(data)
        .then(checkOk)
        .then(({ body }) => body);
};

const addOffer = (id, data, token = null) => {
    return request
        .post(`/api/sales/${id}/offers`)
        .set('Authorization', token)
        .send(data)
        .then(checkOk)
        .then(({ body }) => body);
};

after(done => server.close(done));

module.exports = {
    request,
    save,
    addOffer,
    checkOk,
    simplify
};