const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

describe.only('Users API', () => {

    beforeEach(() => dropCollection('users'));

    let tokenTwo;
    let mongoosey;
    let userTwo = {
        name: 'Mon Goosey',
        email: 'mongoose@mongeese.com',
        password: 'iAmMongooseHearMeRoar'
    };

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userTwo)
            .then(checkOk)
            .then(({ body }) => {
                tokenTwo = body.token;
                // console.log('** body', body);
                mongoosey = body.user;
            });
    });
    // beforeEach(() => {
    //     return request
    //         .post('/api/auth/signin')
    //         .send(userTwo)
    //         .then(checkOk)
    //         .then(({ body }) => {
    //             tokenTwo = body.token;
    //             // console.log('** body', body);
    //             userTwo = body.user;
    //         });
    // });

    it('signs up a user', () => {
        assert.isDefined(tokenTwo);
    });
    
    it('signs in a user', () => {
        assert.isOk(mongoosey._id);
        // return request
        //     .post('/api/auth/signin')
        //     .send(userTwo)
        //     .then(checkOk)
        //     .then(({ body }) => {
        //         assert.isDefined(body.token);
        //     });
    });
    

});