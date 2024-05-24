const { pgConnectionUri } = require('./const');
const Sequelize = require("sequelize");

class DatabaseService {
  constructor() {
    this.sequelize = new Sequelize(pgConnectionUri);
  }
}
module.exports = new DatabaseService();