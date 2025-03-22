const { DataTypes, Model } = require('sequelize'); // Sequelize, Model
const { sequelize } = require('../../config/database');

// Item Model
class Item extends Model {}

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  },
  picture: {
    type: DataTypes.STRING
  },
  meta: {
    type: DataTypes.JSONB
  }
}, {
  sequelize,
  modelName: 'items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Item;