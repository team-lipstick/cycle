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
    checkOk
};