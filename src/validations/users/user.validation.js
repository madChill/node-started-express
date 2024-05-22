const Joi = require('joi');

module.exports = {
  // TODO: Finer validations
  // TODO: OTP verification for Phone Number
  updateUser: {
    body: {
      firstName: Joi.string().max(128),
      lastName: Joi.string().max(128),
      gender: Joi.string(),
      dob: Joi.date().iso(),
      phoneNumber: Joi.string(),
    },
  },
  updatePassword: {
    body: {
      password: Joi.string().required().min(6).max(128),
      currentPassword: Joi.string().required().min(6).max(128),
    },
  },

  addUserAttributionWithKey: {
    body: {
      userId: Joi.number().required(),
      key: Joi.string().required(),
      value: Joi.string().required(),
      appName: Joi.string().required(),
    },
  },
};
