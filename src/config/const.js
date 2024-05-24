require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  jwtAlgorithm: 'RS256',
  jwtExpirationInterval: 2000, // Minutes
  rtExpirationInterval: 90, // Days
  // swaggerUser: process.env.SWAGGER_USER,
  // swaggerPassword: process.env.SWAGGER_PASSWORD,
  pgConnectionUri: process.env.PG_CONNECTION_URI,
  healthCheckPath: '/v1/users/status',
};
