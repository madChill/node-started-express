const { DataTypes, Model } = require('sequelize'); // Sequelize
const { sequelize } = require('../../config/database');
const Permission = require('../permissions/permissions.model');
const RolePermission = require('../rolesPermission/rolesPermission.model');

class Role extends Model {}

Role.init({
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
  }
}, {
  sequelize,
  modelName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });
module.exports = Role;