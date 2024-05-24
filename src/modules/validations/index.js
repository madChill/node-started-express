const UsersValidateService = require('./user.validation.service');
const PasswordValidateService = require('./password.validation.service');
const ItemsValidateService = require('./items.validation.service');
const AuthValidateService = require('./auth.validation.service');

class ValidationsModule {
    constructor() {
        this.UsersValidateService = UsersValidateService;
        this.PasswordValidateService = PasswordValidateService;
        this.ItemsValidateService = ItemsValidateService;
        this.AuthValidateService = AuthValidateService;
    }
}

module.exports = new ValidationsModule() 