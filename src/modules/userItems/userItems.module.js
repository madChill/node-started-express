const { DataTypes, Model } = require('sequelize'); // Sequelize, 
const sequelize = require('./database');
const Item = require('../items/items.model');
// UserItem Model
class UserItem extends Model {}

UserItem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Item,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // assuming User model is defined
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'users_items',
  timestamps: false // No timestamps in this table
});

module.exports = UserItem