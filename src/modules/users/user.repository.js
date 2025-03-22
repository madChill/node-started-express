const User = require('./user.model');

class UserRepository {
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
  async update(id, userData) {
    const user = await User.update(userData, { where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
    return user;
  }
}

module.exports = new UserRepository();