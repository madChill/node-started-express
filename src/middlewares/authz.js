const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const userController = require('../controllers/users/user.controller');
const { roles } = require('../config/const')

module.exports = {
  //authzManagerx
  authzManager: function (obj, act) {
    return async (req, res, next) => {
      try {
        const { user } = req;
        const userRaw = await userController.getUserData(user)
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