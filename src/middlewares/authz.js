const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const userController = require('../controllers/users/user.controller');
const { roles } = require('../config/const');
const { forEach } = require('lodash');

module.exports = {
  //authzManagerx
  authzHasPermission: function (obj, act) {
    return async (req, res, next) => {
      try {
        const { user } = req;
        const userRaw = await userController.getUserData(user)
        let isPermission = false
        console.log(userRaw, obj, act);
        forEach(userRaw.permissions, item => {
          if(obj == item.object && act == item.action) isPermission = true;
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
  },
  authzManager: function (obj, act) {
    return async (req, res, next) => {
      try {
        const { user } = req;
        const userRaw = await userController.getUserData(user)
        let isPermission = false
        forEach(userRaw.permissions, item => {
          if(obj == item.object && act == item.action) isPermission = true;
        })
        if (userRaw.role !== roles.manager && userRaw.role !== roles.admin) {
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
  },
  authzAdmin: function (obj, act) {
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
  },
};