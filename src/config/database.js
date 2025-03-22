const Env = require('./const');
const Sequelize = require("sequelize");

class DatabaseService {
  instance = null;
  constructor() {
    this.sequelize = new Sequelize(Env.dbConnectionUri);
  }
  static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
  }
}
module.exports = new DatabaseService();