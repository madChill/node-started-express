const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Env = require('../config/const');
const logger = require('../config/logger');

const { jwtPublicKey, jwtAlgorithm } = Env;
class PassportService {
  constructor() {
    this.secret = Buffer.from(jwtPublicKey, 'hex')
      .toString('utf8')
      .replace(/\\n/gm, '\n');
    this.jwtOptions = {
      secretOrKey: jwtPublicKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      jsonWebTokenOptions: {
        algorithm: jwtAlgorithm,
      }
    };
  }

  jwt = async (payload, done) => {
    try {
      const { user } = payload
      logger.info('jwt', user)
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  };
}
const PassportServiceInstance = new PassportService();

exports.jwt = new JwtStrategy(PassportServiceInstance.jwtOptions, PassportServiceInstance.jwt);
// exports.client = new BearerStrategy(PassportServiceInstance.verifyApiKey);
