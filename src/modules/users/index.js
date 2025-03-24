const router = require('./user.route');
const controller = require('./user.controller');
const services = require('./user.service');
const models = require('./user.model');

class UsersModule {
    instance = null;
    static getInstance() {
        if (!this.instance) {
            this.instance = new UsersModule();
        }
        return this.instance;
    }
    constructor() {
        if (!UsersModule.instance) {
            UsersModule.instance = this;
        }
        this.router = router;
        this.controller = controller;
        this.models = models;
        this.services = services;
        return UsersModule.instance;
    }
}

module.exports = UsersModule