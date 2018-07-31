#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const { addUser } = require('../cycle/cli/lib/routes/users');
const { addBike, findBike, updateBike, removeBike, listBikes } = require('../cycle/cli/lib/routes/bikes');

const questionsUser = [
    {
        type: 'input',
        name: 'name',
        message: 'UserName'
    },
    {
        type: 'input',
        name: 'email',
        message: 'User Email'
    },
    {
        type: 'password',
        name: 'hash',
        message: 'User Password'
    },
];

const questionsBike = [
    {
        type: 'input',
        name: 'manufacturer',
        message: 'Bike Manufacturer Name'
    },
    {
        type: 'input',
        name: 'model',
        message: 'Bike Model Name'
    },
    {
        type: 'input',
        name: 'year',
        message: 'Bike Year'
    },
    {
        type: 'input',
        name: 'price',
        message: 'Bike Price'
    },
    {
        type: 'input',
        name: 'speeds',
        message: 'Bike Speeds'
    },
    {
        type: 'input',
        name: 'gender',
        message: 'Bike Gender'
    },
    {
        type: 'input',
        name: 'type',
        message: 'Bike Type '
    },
    {
        type: 'input',
        name: 'owner',
        message: 'Bike Owner'
    },
];

const priceBike = [
    {
        type: 'input',
        name: 'price',
        message: 'Bike Price'
    },
];

program
    .version('1.0.0')
    .description('Cycle Management System');

program
    .command('add user')
    .alias('au')
    .description('Add a User')
    .action(() => {
        prompt(questionsUser)
            .then(answers => addUser(answers));
    });

program
    .command('add')
    .alias('a')
    .description('Add a bike')
    .action(() => {
        prompt(questionsBike)
            .then(answers => addBike(answers));
    });

program 
    .command('find <name>')
    .alias('f')
    .description('Find a bike')
    .action(name => findBike(name));

program
    .command('update <_id>')
    .alias('u')
    .description('Update bike price')
    .action(_id => {
        prompt(priceBike)
            .then(answers => updateBike(_id, answers));
    });

program 
    .command('remove <_id>')
    .alias('r')
    .description('Remove a bike')
    .action(_id => removeBike(_id));

program 
    .command('list')
    .alias('l')
    .description('List all bikes')
    .action(() => listBikes());

program.parse(process.argv);