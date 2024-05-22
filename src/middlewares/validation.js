const { celebrate } = require('celebrate');


const DEFAULT_JOI_OPTIONS = {
  abortEarly: false,
  stripUnknown: true,
};

exports.validate = (schema, joiOptions = {}) => {
  const joiOpts = Object.assign({}, DEFAULT_JOI_OPTIONS, joiOptions);
  return celebrate(schema, joiOpts);
};
