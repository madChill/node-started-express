const router = require('./user.route');
const controller = require('./user.controller');
const services = require('./user.service');
const models = require('./user.model');

class UsersModule {
    constructor() {
        this.router = router;
        this.controller = controller;
        this.models = models;
        this.services = services;
    }
}

module.exports = new UsersModule() 