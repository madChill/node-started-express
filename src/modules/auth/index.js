const router = require('./auth.route');
// const controller = require('./auth.service');
// const repository = require('./auth.repository');
const services = require('./auth.service');
// const models = require('./auth.model');
const userModule = require('../../modules/users');


class AuthModule {
    constructor() {
        this.router = router;
    }
}

module.exports = new AuthModule() 