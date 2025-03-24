const { DataTypes, Model } = require('sequelize'); // Sequelize
const { sequelize } = require('../../config/database');
const Role = require('../roles/roles.model');
const Registration = require('../registrations/registrations.model');
const UserRole = require('../usersRoles/usersRoles.model');
class User extends Model { }
User.init({
  // Define user attributes here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  first_name: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.STRING
  },
  phone_number: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING
  },
  device: {
    type: DataTypes.JSONB
  },
  dob: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.belongsToMany(Role, {
  through: UserRole
});
Role.belongsToMany(User, {
  through: UserRole,
});


// A user can be a teacher in many registrations
User.hasMany(Registration, {
  foreignKey: 'teacher_id',
  as: 'teacher_registrations'
});
Registration.belongsTo(User, {
  through: 'student_id',
  as: 'student'
});

module.exports = User;
