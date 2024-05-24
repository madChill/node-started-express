const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const UserRole = sequelize.define('user_roles', {
    roleId: {
        type: DataTypes.INTEGER,
        field: 'role_id',
    },
    userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
    },
    meta: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
}, { timestamps: false });
module.exports = UserRole;