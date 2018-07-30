const { assert } = require('chai');
const { dropCollection } = require('./db');
const { checkOk, save, request } = require('./request');

describe.only('Sale API', () => {

    beforeEach(() => dropCollection('sales'));

    
});
