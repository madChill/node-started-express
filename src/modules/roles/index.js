const services = require('./roles.service');
const models = require('./roles.model');

class RolesModule {
    constructor() {
        this.models = models;
        this.services = services;
    }
}

module.exports = new RolesModule() 