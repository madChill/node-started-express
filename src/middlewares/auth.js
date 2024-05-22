const httpStatus = require('http-status');
const passport = require('passport');
const Promise = require('bluebird');
const APIError = require('../utils/APIError');


const handleJWT = (req, res, next) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) {
      throw new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
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

    await logIn(user, { session: false });
  } catch (e) {
    return next(e);
  }

  if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};

const handleSocialAuth = (req, res, next) => async (err, user, info) => {
  const error = err || info;

  const logIn = Promise.promisify(req.logIn);

  if (error) {
    return next(error);
  }

  try {
    if (!user) {
      throw new APIError({
        message: 'Invalid Access Token',
        errors: ['invalid_access_token'],
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
    
    await logIn(user, { session: false });
  } catch (e) {
    return next(e);
  }

  req.user = user;

  return next();
};

const handleJWTBlockedUser = (req, res, next) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) {
      throw new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
      });
    }

    await logIn(user, { session: false });
  } catch (e) {
    return next(e);
  }

  if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};



exports.authorize = () => (req, res, next) => passport.authenticate(
  'jwt', { session: false },
  handleJWT(req, res, next),
)(req, res, next);


exports.authBlockedUser = () => (req, res, next) => passport.authenticate(
  'jwt', { session: false },
  handleJWTBlockedUser(req, res, next),
)(req, res, next);
