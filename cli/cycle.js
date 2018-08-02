const inquirer = require('inquirer');

const authQuestions = [
    {
        type: 'list',
        name: 'authorization',
        choices: [
            { name: 'Sign In', value: 'signIn' },
            { name: 'Sign Up', value: 'signUp' }
        ]
    },
    {
        type: 'input',
        name: 'name',
        message: 'Enter your name'
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter your email'
    },
    {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'Enter your password'
    }
];

class Cycle {
    constructor(api) {
        this.api = api;
        this.signup = false;
        this.token;
    }

    start() {
        inquirer
            .prompt(authQuestions)
            .then(({ name, email, password }) => {
                if(this.signup) return this.api.signup({ name, email, password });
                else return this.api.signin({ name, email, password });
            })
            .catch(console.log); //eslint-disable-line
    }
}

module.exports = Cycle;