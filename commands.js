const program = require('commander');
const { prompt } = require('inquirer');
const { addBike, findBike, updateBike, removeBike, listBikes } = require('../cycle/cli/lib/index');

const questions = [
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
        message: 'Bike speeds'
    },
    {
        type: 'input',
        name: 'gender',
        message: 'Bike Gender'
    },
    {
        type: 'input',
        name: 'type',
        message: 'Bike Type Name'
    },
];

const priceQ = [
    {
        type: 'input',
        name: 'price',
        message: 'Bike Price'
    },
];

program
    .version('1.0.0')
    .description('Bike Management System');

program
    .command('add')
    .alias('a')
    .description('Add a bike')
    .action(() => {
        prompt(questions)
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
        prompt(priceQ)
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