const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const moment = require('moment-timezone');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const APIError = require('../utils/APIError');
const {
  jwtSecret,
  jwtPublicKey,
  jwtAlgorithm,
  jwtExpirationInterval,
} = require('../config/const');
const User = require('../models/user.model');

const jwtVerifyAsync = Promise.promisify(jwt.verify);
const jwtSignAsync = Promise.promisify(jwt.sign);

/**
 * Generate Access Token
 */
exports.generateAccessToken = async (user, client = null, device = null) => {
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

  if (client && client.clientId) {
    payload.app = client.clientId;
  }

  if (device && device.udid) {
    payload.udid = device.udid;
  }

  const secret = Buffer.from(jwtSecret, 'hex')
  .toString('utf8')
  .replace(/\\n/gm, '\n')

  const token = await jwtSignAsync(payload, jwtSecret, {
    algorithm: jwtAlgorithm,
  });

  return {
    token,
    jti,
    exp,
  };
};


/**
 * Generate Refresh Token.
 */
exports.generateRefreshToken = (user, scope) => {
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

/**
 * Get Access Token
 */
exports.validateAccessToken = async (accessToken) => {
  try {
    
    const secret = Buffer.from(jwtPublicKey, 'hex')
    .toString('utf8')
    .replace(/\\n/gm, '\n')

    const decodedToken = await jwtVerifyAsync(accessToken, jwtPublicKey, {
      algorithms: [jwtAlgorithm],
    });

    if (!decodedToken) {
      throw new APIError({
        message: 'Invalid Access Token',
        errors: ['invalid_access_token'],
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      });
    }
    return decodedToken;
  } catch (e) {
    throw e;
  }
};


/**
 * Get user.
 */
exports.getUser = async (username, password) => {
  const user = await User.query().where('email', '=', username).first();

  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new APIError({
      message: 'Email and password combination does not match',
      errors: ['invalid_credentials'],
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    });
  }
  if (user.status === 'blocked') {
    throw new APIError({
      message: 'User is blocked',
      errors: ['user_blocked'],
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    });
  }
  if (user.status === 'deleted') {
    throw new APIError({
      message: 'User is deleted',
      errors: ['user_deleted'],
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    });
  }
  return user;
};