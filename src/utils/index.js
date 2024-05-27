// const controller = require('./auth.service');
// const repository = require('./auth.repository');
const APIError = require('./APIError.service');

class UtilsModule {
    constructor() {
        this.APIError = APIError
    }
}

module.exports = new UtilsModule() 