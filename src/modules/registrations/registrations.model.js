const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');
class Registration extends Model { }

Registration.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
    defaultValue: 'pending',
    allowNull: false
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Registration',
  tableName: 'registration_students',
  timestamps: true,
  underscored: true, // Use snake_case for column names
  indexes: [
    {
      fields: ['student_id']
    },
    {
      fields: ['teacher_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['student_id', 'teacher_id'],
      unique: true
    }
  ]
});



module.exports = Registration;