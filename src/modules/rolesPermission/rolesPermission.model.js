const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const RolePermission = sequelize.define('role_permissions', {
    meta: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        field: 'role_id',
    },
    permissionId: {
        type: DataTypes.INTEGER,
        field: 'permission_id',
    },
}, { timestamps: false });
module.exports = RolePermission;