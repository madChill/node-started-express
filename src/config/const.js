const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

class Env {
  instance = null;
  constructor() {
    const baseEnvPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(baseEnvPath)) {
      dotenv.config({ path: baseEnvPath });
      console.log(`Loaded base environment from ${baseEnvPath}`);
    }
    // Determine environment
    const NODE_ENV = process.env.NODE_ENV || 'development';
    // Load environment-specific file (overrides base settings)
    const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`Loaded ${NODE_ENV} environment from ${envPath}`);
    } else {
      console.log(`Environment file ${envPath} not found, using defaults`);
    }
    if (Env.instance) {
      return Env.instance;
    }
    this.jwtPublicKey = process.env.JWT_PUBLIC_KEY
    this.jwtSecret = process.env.JWT_SECRET
    this.jwtAccessExpirationMinutes = process.env.JWT_ACCESS_EXPIRATION_MINUTES
    this.jwtRefreshExpirationDays = process.env.JWT_REFRESH_EXPIRATION_DAYS
    this.jwtResetPasswordExpirationMinutes = process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES
    this.jwtVerifyEmailExpirationMinutes = process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    this.jwtAlgorithm = 'RS256'
    this.jwtExpirationInterval = 2000
    this.rtExpirationInterval = 90
    this.dbConnectionUri = process.env.DB_CONNECTION_URI
    this.permission = {
      user: {
        create: 'user:create',
        read: 'user:read',
        update: 'user:update',
        delete: 'user:delete'
      },
    }
    // Store instance
    Env.instance = this;
  }

  static getInstance() {
    if (!Env.instance) {
      Env.instance = new Env();
    }
    return Env.instance;
  }
}
module.exports = Env.getInstance();