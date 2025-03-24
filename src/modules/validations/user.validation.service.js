const Joi = require('joi');
class UsersValidateService {
  instance = null
  static getInstance() {
    if (!this.instance) {
      this.instance = new UsersValidateService()
    }
    return this.instance
  }
  constructor() {
    if (!UsersValidateService.instance) {
      UsersValidateService.instance = this;
    }
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
    this.registerStudents = {
      body: {
        teacher: Joi.string().email().required(),
        students: Joi.array().items(Joi.string().email()).required(),
      }
    }
    this.commonStudents = {
      query: {
        teacher: Joi.alternatives().try(
          Joi.string().email(),
          Joi.array().items(Joi.string().email())
        ).required(),
      }
    }
    this.suspendStudents = {
      body: {
        student: Joi.string().email().required(),
      }
    }
    this.retrieveForNotifications = {
      body: {
        teacher: Joi.string().email().required(),
        notification: Joi.string().required(),
      }
    }
    UsersValidateService.instance = this;
  }
}
module.exports = new UsersValidateService()
