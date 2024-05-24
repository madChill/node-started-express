const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');
const userModule = require('../users');
const { roles } = require('../../config/const');
const { forEach } = require('lodash');

class MiddwareAuthService {
  constructor() { };

  authzHasPermission(obj, act) {
    return async (req, res, next) => {
      try {
        const { user } = req;
        const userRaw = await userModule.services.getUserData(user)
        let isPermission = false
        console.log(userRaw, obj, act);
        forEach(userRaw.permissions, item => {
          if (obj == item.object && act == item.action) isPermission = true;
        })
        if (!isPermission) {
          throw new APIError({
            message: 'Insufficient permissions',
            errors: ['insufficient_permissions'],
            status: httpStatus.FORBIDDEN,
            isPublic: true,
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  };
  authzAdmin(obj, act) {
    return async (req, res, next) => {
      try {
        const { user } = req;
        const userRaw = await userController.getUserData(user)
        if (!userRaw.role != roles.admin) {
          throw new APIError({
            message: 'Insufficient permissions',
            errors: ['insufficient_permissions'],
            status: httpStatus.FORBIDDEN,
            isPublic: true,
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  };
}

module.exports = new MiddwareAuthService()