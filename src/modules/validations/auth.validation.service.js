const Joi = require('joi');
class AuthValidateService {
  constructor() {
    this.register =  {
      body: {
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).max(128),
        firstName: Joi.string().max(128).required(),
        lastName: Joi.string().max(128).allow(''),
        gender: Joi.string(),
        dob: Joi.date().iso().required(),
        phoneNumber: Joi.string().required(),
        device: Joi.object({
          language: Joi.any().allow('', null),
          type: Joi.any().allow('', null),
        }),
      },
    }
    this.login = {
      body: {
        email: Joi.string().trim().email().required(),
        password: Joi.string().required().max(128),
        device: Joi.object({
          type: Joi.any().allow('', null),
          language: Joi.any().allow('', null),
        }),
      },
    }
    this.validateEmail = {
      body: {
        email: Joi.string().trim().email().required(),
        clientId: Joi.string().required().max(128),
        clientSecret: Joi.string().max(128),
      },
    }
    this.checkUser ={
      body: {
        email: Joi.string().trim().email().required(),
        phoneNumber: Joi.string().min(6).max(20).required(),
      },
    }
  }
}
module.exports = new AuthValidateService()




