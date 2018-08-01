const inquirer = require('inquirer');

const prompt = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter your username:'
    },
    {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'Enter your password:',
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
            .prompt(prompt)
            .then(({ name, password }) => {
                if(this.signup) return this.api.signup({ name, password });
                else return this.api.signin({ name, password });
            });
    }
}

module.exports = Cycle;