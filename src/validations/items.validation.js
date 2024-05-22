const Joi = require('joi');

module.exports = {
  // POST /v1/auth/register
  items: {
    body: {
      name: Joi.string().min(6).max(128),
      picture: Joi.string().required(),
      meta: Joi.object({
        language: Joi.any().allow('', null),
        type: Joi.any().allow('', null),
      }),
    },
  },
};
