const httpStatus = require('http-status');
const APIError = require('../utils/APIError.service');
const UserService = require('../modules/users/user.service');
const { roles } = require('../config/const');
const { forEach } = require('lodash');

class MiddwareAuthService {
  instance = null;
  static getInstance() {
    if (!this.instance) {
      this.instance = new MiddwareAuthService();
    }
    
    return this.instance;
  }
  constructor() {
    if (!MiddwareAuthService.instance) {
      MiddwareAuthService.instance = this;
    }
    this.permissions = {
      'user': {
        'create': 'user:create',
        'read': 'user:read',
        'update': 'user:update',
        'delete': 'user:delete',
      },
      'registration': {
        'create': 'registration:create',
        'read': 'registration:read',
        'update': 'registration:update',
        'delete': 'registration:delete',
      },
      'notification': {
        'create': 'notification:create',
        'read': 'notification:read',
        'update': 'notification:update',
        'delete': 'notification:delete',
      },
    }
    return MiddwareAuthService.instance;
   };

  authzHasPermission(obj, act) {
    return async (req, res, next) => {
      try {
        const { user } = req;
        const userRaw = await UserService.getUserData(user)
        let isPermission = false
        if (!act) { // obj: 'user:create'
          act = obj.split(':')[1];
          obj = obj.split(':')[0];
        }
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
  authzAdmin() {
    return async (req, res, next) => {
      try {
        const { user } = req;
        console.log(this.userModule, "222=====user============");
        const userRaw = await UserService.getUserData(user)
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