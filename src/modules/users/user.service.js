const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { get, map, forEach, pick } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const APIError = require('../../utils/APIError');
const Roles = require('../roles/roles.model');
const Permission = require('../permissions/permissions.model');
const UserRepository = require('./user.repository');
const { log } = require('winston');

class UserService {
  getUserByEmail = async (email) => {
    const user = await UserRepository.findByEmail(email);
    return user;
  }
  getUserData = async (user) => {
    const userData = this.transform(user);
    const attributions = await UserRepository.findById(user.id, {
      include: [
        {
          model: Roles,
          as: 'roles',
          include: [
            {
              model: Permission,
              as: 'permissions'
            }
          ]
        }
      ]
    })
    let permissions = []
    forEach(attributions.get({ plain: true }).roles, item => {
      permissions = permissions.concat(get(item, 'permissions', []))
    })
    userData.permissions = permissions;
    return userData;
  };
  loggedIn = async (req, res, next) => {
    try {
      const user = await this.getUserData(req.user, req.headers);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };
  updatePassword = async ({ password, currentPassword }, { user }) => {
    try {
      if (!await bcrypt.compare(currentPassword, user.password)) {
        throw new APIError({
          message: 'Password is incorrect',
          errors: ['invalid_credentials'],
          status: httpStatus.UNAUTHORIZED,
          isPublic: true,
        });
      }

      return await UserRepository.update(user.id, { password: await bcrypt.hash(password, 10) });

    } catch (error) {
      throw error;
    }
  };
  transform(user) {
    const userData = pick(user, ['id', 'uuid', 'email', 'firstName', 'lastName', 'role',
      'gender', 'dob', 'phoneNumber'
    ]);
    return userData;
  }
  create = async (userInput) => {
    const password = userInput.password || uuidv4();
    const userData = this.transform(userInput);
    const { dob } = userData;
    const age = moment().endOf('year').diff(dob, 'years');
    if (age < 18) {
      throw new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'dob',
          location: 'auth',
          messages: ['Not old enough to register'],
        }],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    let userDuplicated = await this.getUserByEmail(userData.email);
    if (userDuplicated) {
      throw new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'auth',
          messages: ['Email existed'],
        }],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    userData.password = await bcrypt.hash(password, 10);
    userData.email = userData.email.toLowerCase();
    return await UserRepository.create(userData);
  }
}

module.exports = new UserService()