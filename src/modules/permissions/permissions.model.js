const { DataTypes, Model } = require('sequelize'); // Sequelize, Model
const { sequelize } = require('../../config/database');

class Permission extends Model { }

Permission.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  },
  slug: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  object: {
    type: DataTypes.STRING
  },
  action: {
    type: DataTypes.STRING
  }

}, {
  sequelize,
  modelName: 'permission',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Permission;
