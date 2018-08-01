const program = require('commander');
const { prompt } = require('inquirer');
const { addUser } = require('./lib/routes/users');

const questionsUser = [
    {
        type: 'list',
        name: 'auth',
        message: 'Sign in or sign up',
        choices: [
            { name: 'Sign in', value: 'signIn' },
            { name: 'Sign up', value: 'signUp' }
        ]
    },
    {
        type: 'input',
        name: 'name',
        message: 'Enter User Name'
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter User Email'
    },
    {
        type: 'password',
        name: 'hash',
        mask: '*',
        message: 'Enter User Password'
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

program.parse(process.argv);