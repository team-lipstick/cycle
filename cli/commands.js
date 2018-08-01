#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
// const { addUser } = require('../cycle/cli/lib/routes/users');
const { addBike, findBike, updateBike, removeBike, listBikes } = require('./lib/routes/bikes');

// const questionsUser = [
//     {
//         type: 'list',
//         name: 'auth',
//         message: 'Sign in or sign up',
//         choices: [
//             { name: 'Sign in', value: 'signIn' },
//             { name: 'Sign up', value: 'signUp' }
//         ]
//     },
//     {
//         type: 'input',
//         name: 'name',
//         message: 'Enter User Name'
//     },
//     {
//         type: 'input',
//         name: 'email',
//         message: 'User User Email'
//     },
//     {
//         type: 'password',
//         name: 'hash',
//         mask: '*',
//         message: 'Enter User Password'
//     },
// ];

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
    // {
    //     type: 'input',
    //     name: 'owner',
    //     message: 'Bike Owner'
    // },
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

// program
//     .command('add user')
//     .alias('au')
//     .description('Add a User')
//     .action(() => {
//         prompt(questionsUser)
//             .then(answers => addUser(answers));
//     });

program
    .command('add bike')
    .alias('ab')
    .description('Add a bike')
    .action(() => {
        prompt(questionsBike)
            .then(answers => addBike(answers));
    });

program 
    .command('find bike <name>')
    .alias('fb')
    .description('Find a bike')
    .action(name => findBike(name));

program
    .command('update bike<_id>')
    .alias('ub')
    .description('Update bike price')
    .action(_id => {
        prompt(priceBike)
            .then(answers => updateBike(_id, answers));
    });

program 
    .command('remove bike<_id>')
    .alias('rb')
    .description('Remove a bike')
    .action(_id => removeBike(_id));

program 
    .command('list bike')
    .alias('lsb')
    .description('List all bikes')
    .action(() => listBikes());

program.parse(process.argv);