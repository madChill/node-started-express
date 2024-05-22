const Joi = require('joi');

module.exports = {
  reset: {
    body: Joi.object().keys({
      phoneNumber: Joi.string().min(6).max(20).allow(null),
      email: Joi.string().email().allow(null),
    }).or('phoneNumber', 'email').and('phoneNumber'),
  },
  confirm: {
    body: {
      token: Joi.string().required(),
      password: Joi.string().required().min(6).max(128),
    },
  },
};
