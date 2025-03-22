const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const APIError = require('../../utils/APIError.service');
const userModule = require('../../modules/users');
const {
  jwtSecret,
  jwtAlgorithm,
  jwtExpirationInterval,
} = require('../../config/const');

class AuthService {
  constructor({ userModule }) {
    this.userModule = userModule
  }
  /**
 * Generate Access Token
 */
  generateAccessToken = async (user) => {
    if (!user) {
      throw new APIError({
        message: 'Unauthorized',
        errors: ['unauthorized'],
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      });
    }

    const jti = `${user.id}.${uuidv4()}`;
    const exp = moment().add(jwtExpirationInterval, 'minutes');
    const payload = {
      exp: exp.unix(),
      iat: moment().unix(),
      sub: user.id,
      jti,
      user: omit(user, ['password']),
    };

    const token = await this.jwtSignAsync(payload, jwtSecret, {
      algorithm: jwtAlgorithm,
    });

    return {
      token,
      jti,
      exp,
    };
  };

  generateRefreshToken = (user, scope) => {
    if (!user) {
      throw new APIError({
        message: 'Unauthorized',
        errors: ['unauthorized'],
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      });
    }

    return `${user.id}.${crypto.randomBytes(40).toString('hex')}`;
  };

  jwtVerifyAsync = Promise.promisify(jwt.verify);
  jwtSignAsync = Promise.promisify(jwt.sign);
  /**
 * Returns jwt token if successful
 * @public
 */
  generateTokenResponse = async (user, client = null, device = null) => {
    const accessToken = await this.generateAccessToken(user, client, device);
    const refreshToken = await this.generateRefreshToken(user);
    const updatedUser = userModule.services.transform(user);
    return {
      token: {
        tokenType: 'Bearer',
        accessToken: accessToken.token,
        refreshToken,
        expiresIn: accessToken.exp,
      },
      user: updatedUser,
    };
  }
  /**
 * Returns jwt token if registration was successful
 * @public
 */
  register = async (userInput) => { //req, res, next
    const user = await this.userModule.services.create(userInput)
    const tokenResponse = await this.generateTokenResponse(user);
    return tokenResponse;
  };
  /**
   * Returns jwt token if valid username and password is provided
   * @public
   */
  login = async ({ email, password }) => {
    try {
      let user = await this.userModule.services.getUserByEmail(email);
      user = user.get({ plain: true });
      const invalidCredsErr = new APIError({
        message: 'Email and password combination does not match',
        errors: ['invalid_credentials'],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
      if (user && !await bcrypt.compare(password, user.password)) {
        throw invalidCredsErr;
      }

      if (!user) {
        throw invalidCredsErr;
      }

      if (user.status === 'blocked') {
        throw new APIError({
          message: 'User is blocked',
          errors: ['user_blocked'],
          status: httpStatus.UNAUTHORIZED,
          isPublic: true,
        });
      }
      return await this.generateTokenResponse(user);
    } catch (error) {
      console.log(error, "auth")
      throw error;
    }
  };
}
module.exports = new AuthService({ userModule })







