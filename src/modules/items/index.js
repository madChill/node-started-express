const router = require('./items.route');
// const controller = require('./auth.service');
// const repository = require('./auth.repository');
// const services = require('./items.service');
const models = require('./items.model');

class ItemsModule {
    constructor() {
        this.router = router;
        this.models = models;
    }
}

module.exports = new ItemsModule() 