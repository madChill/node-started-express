const User = require('./user.model');
const Registration = require('../registrations/registrations.model');
const { Op } = require('sequelize');
class UserRepository {
  instance = null;
  constructor() {
    if (!UserRepository.instance) {
      UserRepository.instance = this;
    }
    return UserRepository.instance;
  }
  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }
  async create(userData) {
    const user = await User.create(userData);
    return user;
  }
  findById = (id, options) => {
    return User.findByPk(id, options);
  }
  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  }
  async findByEmails(emails) {
    const users = await User.findAll({ where: { email: emails } });
    return users
  }
  async bulkCreate(users) {
    const response = await User.bulkCreate(users);
    return response;
  }
  async update(id, userData) {
    const user = await User.update(userData, { where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
    return user;
  }
  getCommonStudents = async (teachers_list, students_existed) => {
    let query = `SELECT DISTINCT u.email from users u 
      inner join registration_students rs on rs.student_id = u.id 
      INNER  JOIN  users u2 on rs.teacher_id = u2.id 
      where u2.email in (:teachers_list) and rs.status = 'approved'
      `;// LIMIT 0,2(offset, limit)
    let params = { teachers_list };
    // check students_existed is not empty includes where clause to query
    if (students_existed.length > 0) {
      query += ` and u.email not in (:students_existed)`;
      params.students_existed = students_existed;
    }
    const students = await User.sequelize.query(query, {
      replacements: params,
      type: User.sequelize.QueryTypes.SELECT
    });
    return students;
  }
}

module.exports = new UserRepository();