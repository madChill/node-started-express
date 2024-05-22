const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const APIError = require('../../utils/APIError');
const User = require('../../models/user.model');
const {
  getClient,
  generateAccessToken,
  generateRefreshToken,
} = require('../oauth2.controller');

/**
 * Returns jwt token if successful
 * @public
 */
const generateTokenResponse = async (user, client = null, device = null) => {
  const accessToken = await generateAccessToken(user, client, device);
  const refreshToken = await generateRefreshToken(user);

  // await saveToken(accessToken.jti, refreshToken, user, client);

  const updatedUser = User.transform(user);
  // Adding country here too to keep compatibility with older app versions
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
exports.register = async (req, res, next) => {
  try {
    const { dob } = req.body;
    const userData = User.transform(req.body);
    /**
     * User who register should age > 17 in ID
     */
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

    const userDuplicated = await User.query()
      .where('email', '=', userData.email)
      .first();
    if(userDuplicated){
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

    const password = 'password' in req.body ? req.body.password : uuidv4();
    userData.password = await bcrypt.hash(password, 10);
    userData.email = userData.email.toLowerCase();
    userData.role = "users"
    const user = await User.query().insert(userData).returning('*');
    res.status(httpStatus.CREATED);

    const tokenResponse = await generateTokenResponse(user);

    return res.json(tokenResponse);
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;


    let user = await User.query().where('email', '=', email).first();
    let isMigrated = false;

    const invalidCredsErr = new APIError({
      message: 'Email and password combination does not match',
      errors: ['invalid_credentials'],
      status: httpStatus.UNAUTHORIZED,
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


    const tokenResponse = await generateTokenResponse(user);

    return res.json({
      ...tokenResponse,
      isMigrated,
    });
  } catch (error) {
    console.log(error, "auth")
    return next(error);
  }
};

exports.checkUser = async (req, res, next) => {
  try {
    parsePhone(req.body);
    const {
      email,
      clientId,
      clientSecret,
    } = req.body;

    await getClient(clientId, clientSecret);

    const user = await User.query()
      .where('email', '=', email)
      .first();

    return res.json({
      exists: user ? user.uuid : false,
    });
  } catch (error) {
    return next(error);
  }
};
