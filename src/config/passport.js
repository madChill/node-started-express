const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const CustomStrategy = require('passport-custom');
const BearerStrategy = require('passport-http-bearer');
const httpStatus = require('http-status');
const { jwtPublicKey, jwtAlgorithm } = require('./const');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');

const secret = Buffer.from(jwtPublicKey, 'hex')
.toString('utf8')
.replace(/\\n/gm, '\n')

const jwtOptions = {
  secretOrKey: jwtPublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  jsonWebTokenOptions: {
    algorithm: jwtAlgorithm,
  },
};

const jwt = async (payload, done) => {
  try {
    const user = await User.query().findById(payload.sub)
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};


const verifyApiKey = async (apiKey, done) => {
  const client = await Client.query().where('api_key', '=', apiKey).whereNotNull('api_key').first();

  if (client) return done(null, client);

  return done(new APIError({
    message: 'Invalid API Key',
    errors: ['invalid_api_key'],
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  }), false);
};


exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.client = new BearerStrategy(verifyApiKey);
