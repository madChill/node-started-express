const Env = require('./const');
const Sequelize = require("sequelize");

// this.dbHost = process.env.DB_HOST
    // this.dbName = process.env.DB_NAME
    // this.dbUser = process.env.DB_USER
// this.dbPass = process.env.DB_PASS
    
class DatabaseService {
  instance = null;
  constructor() {
    this.sequelize = new Sequelize(Env.dbName, Env.dbUser, Env.dbPass, {
      host: Env.dbHost,
      dialect: 'mysql',
      logging: false,
    });
    if (!DatabaseService.instance) {
      DatabaseService.instance = this;
    }
    return DatabaseService.instance;
  }
  static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
  }
}
module.exports = new DatabaseService();