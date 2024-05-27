const httpStatus = require('http-status');
const { isCelebrate } = require('celebrate');
const { find } = require('lodash');
const APIError = require('../utils/APIError.service');
const { env } = require('../config/const');

class MiddwareErrorService {
  constructor() { }
  /**
 * Error handler. Send stacktrace only during development
 * @public
 */
  handler = (err, req, res, next) => {
    const response = {
      code: err.status,
      message: err.message || httpStatus[err.status],
      errors: err.errors,
      stack: err.stack,
    };

    if (err.meta) {
      response.meta = err.meta;
    }

    if (env !== 'development') {
      delete response.stack;
    }

    res.status(err.status);
    res.json(response);
  };

  /**
   * If error is not an instanceOf APIError, convert it.
   * @public
   */
  converter = (err, req, res, next) => {
    let convertedError = err;

    if (isCelebrate(err)) {
      const errObj = [];
      err.details.forEach((error) => {
        const errorExists = find(errObj, (item) => {
          if (item.field === error.path) {
            item.messages.push(error.message);
            item.types.push(error.type);
            return item;
          }
          return false;
        });

        if (!errorExists) {
          errObj.push({
            field: error.path,
            location: err._meta.source,
            messages: [error.message],
            types: [error.type],
          });
        }
      });
      convertedError = new APIError({
        message: 'Validation Error',
        errors: errObj,
        status: httpStatus.BAD_REQUEST,
        stack: err.stack,
      });
    } else if (!(err instanceof APIError)) {
      if (!err.status && env !== 'development') {
        convertedError = new APIError({
          message: 'Internal Server',
          errors: ['internal_server_error'],
          status: httpStatus.INTERNAL_SERVER_ERROR,
          stack: err.stack,
        });
      } else {
        convertedError = new APIError({
          message: err.message,
          status: err.status,
          stack: err.stack,
        });
      }
    }

    return this.handler(convertedError, req, res);
  };

  /**
   * Catch 404 and forward to error handler
   * @public
   */
  notFound = (req, res, next) => {
    const err = new APIError({
      message: 'Not found',
      status: httpStatus.NOT_FOUND,
    });
    return handler(err, req, res);
  };
}

module.exports = new MiddwareErrorService();
