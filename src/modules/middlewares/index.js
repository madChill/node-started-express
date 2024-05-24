// const controller = require('./auth.service');
// const repository = require('./auth.repository');
const MiddwareValidateService = require('./middware.validation.service');

class MiddlewaresModule {
    constructor() {
        this.MiddwareValidateService = MiddwareValidateService;
    }
}

module.exports = new MiddlewaresModule() 