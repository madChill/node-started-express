const Joi = require('joi');
class UsersValidateService {
  constructor() {
    this.updateUser = {
      body: {
        firstName: Joi.string().max(128),
        lastName: Joi.string().max(128),
        gender: Joi.string(),
        dob: Joi.date().iso(),
        phoneNumber: Joi.string(),
      },
    }
    this.updatePassword = {
      body: {
        password: Joi.string().required().min(6).max(128),
        currentPassword: Joi.string().required().min(6).max(128),
      },
    }
  }
}
module.exports = new UsersValidateService()
