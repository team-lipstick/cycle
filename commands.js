const program = require('commander');
// const { addBike, findBike } = require('./index');

program
    .version('1.0.0')
    .description('Bike Management System');

program.parse(process.argv);