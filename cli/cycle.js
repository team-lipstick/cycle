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

const firstQuestions = [
    {
        type: 'list',
        name: 'Welcome!',
        choices: [
            { name: 'Browse bikes', value: 'getBike' },
            { name: 'Post a bike', value: 'postbikes' }
        ]
    }
];

class Cycle {
    constructor(api) {
        this.api = api;
        this.signup = false;
        this.token;
        this.bikes = [];
    }

    start() {
        inquirer
            .prompt(authQuestions)
            .then(({ name, email, password }) => {
                if(this.signup) return this.api.signup({ name, email, password });
                // else return this.api.signin({ name, email, password });
            })
            .then(() => {
                inquirer
                    .prompt(firstQuestions)
                    .then(({ answer }) => {
                        if(answer === 'getBike') return this.api.getBike()
                            .then(bikes => {
                                console.log(bikes);
                                this.bikes = bikes;
                                console.log(this.bikes);
                            });
                    });
            });
    }
}

module.exports = Cycle;