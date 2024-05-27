const { celebrate } = require('celebrate');


const DEFAULT_JOI_OPTIONS = {
  abortEarly: false,
  stripUnknown: true,
};
class MiddwareValidateService {
  constructor() { }
  validate = (schema, joiOptions = {}) => {
    const joiOpts = Object.assign({}, DEFAULT_JOI_OPTIONS, joiOptions);
    return celebrate(schema, joiOpts);
  };
}

module.exports = new MiddwareValidateService();   
  