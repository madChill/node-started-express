const Joi = require('joi');
class ItemsValidateService {
  constructor() {
    this.items = {
      body: {
        name: Joi.string().min(6).max(128),
        picture: Joi.string().required(),
        meta: Joi.object({
          language: Joi.any().allow('', null),
          type: Joi.any().allow('', null),
        }),
      },
    }
  }
}
module.exports = new ItemsValidateService()