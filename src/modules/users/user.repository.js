const User = require('./user.model');

class UserRepository {
  async create(userData) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }
  findById = (id, options) => {
    return User.findByPk(id, options);
  }
  async findByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async update(id, userData) {
    try {
      const user = await User.update(userData, { where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();