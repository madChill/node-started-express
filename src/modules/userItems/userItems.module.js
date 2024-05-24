const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

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