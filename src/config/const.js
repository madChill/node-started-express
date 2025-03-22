require('dotenv').config();

class Env {
  instance = null;
  constructor() {
    // Check if instance already exists
    if (Env.instance) {
      return Env.instance;
    }
    this.env = process.env.NODE_ENV || 'development'
    this.port = process.env.PORT || 3000
    this.jwtSecret = process.env.JWT_SECRET
    this.jwtAccessExpirationMinutes = process.env.JWT_ACCESS_EXPIRATION_MINUTES
    this.jwtRefreshExpirationDays = process.env.JWT_REFRESH_EXPIRATION_DAYS
    this.jwtResetPasswordExpirationMinutes = process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES
    this.jwtVerifyEmailExpirationMinutes = process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    this.jwtAlgorithm = 'RS256'
    this.jwtExpirationInterval = 2000
    this.rtExpirationInterval = 90
    this.pgConnectionUri = process.env.PG_CONNECTION_URI
    // Store instance
    // Env.instance = this;
  }

  static getInstance() {
    if (!Env.instance) {
      Env.instance = new Env();
    }
    return Env.instance;
  }
}
module.exports = Env.getInstance();