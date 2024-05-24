const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { get, map, forEach, pick } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const APIError = require('../../utils/APIError');
const User = require('./user.model');

class UserService {
  getUserByEmail = async (email) => {
    const user = await User.query().where('email', '=', email).first();
    return user;
  }
  getUserData = async (user) => {
    const userData = User.transform(user);
    const attributions = await User.query()
      .where('id', '=', user.id)
      .withGraphFetched('[roles.[permissions]]')
      .first();
    let permissions = []
    forEach(attributions.roles, item => {
      permissions = permissions.concat(get(item, 'permissions', []))
    })

    userData.permissions = permissions;
    userData.attributions = (attributions && attributions.attributions) ? attributions.attributions : [];
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
  updatePassword = async (req, res, next) => {
    try {
      const { password, currentPassword } = req.body;

      if (!await bcrypt.compare(currentPassword, req.user.password)) {
        throw new APIError({
          message: 'Password is incorrect',
          errors: ['invalid_credentials'],
          status: httpStatus.UNAUTHORIZED,
          isPublic: true,
        });
      }

      await User.query()
        .patch({
          password: await bcrypt.hash(password, 10),
        })
        .where('id', '=', req.user.id)
        .first();

      return res.json({ success: true });
    } catch (error) {
      return next(error);
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
    userData.role = "users"
    return await User.query().insert(userData).returning('*');
  }
}

module.exports = new UserService()