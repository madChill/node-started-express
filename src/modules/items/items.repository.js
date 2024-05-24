const Items = require('./items.model');

class ItemsRepository {
  async create(userData) {
    try {
      const user = await Items.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }
  findAndCountAll = async ({ offset, limit, order, where }) => {
    try {
      return Items.findAndCountAll({ offset, limit, order, where });
    } catch (error) {
      throw error;
    }
  }

  findById = (id, options) => {
    return User.findByPk(id, options);
  }
  async findByEmail(email) {
    try {
      const user = await Items.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async update(id, userData) {
    try {
      const user = await Items.update(userData, { where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ItemsRepository();