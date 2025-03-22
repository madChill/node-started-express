const Items = require('./items.model');

class ItemsRepository {
  async create(userData) {
    const user = await Items.create(userData);
    return user;
  }
  findAndCountAll = async ({ offset, limit, order, where }) => {
    return Items.findAndCountAll({ offset, limit, order, where });
  }

  findById = (id, options) => {
    return Items.findByPk(id, options);
  }
  async findByEmail(email) {
    const user = await Items.findOne({ where: { email } });
    return user;
  }
  async update(id, userData) {
    const user = await Items.update(userData, { where: { id } });
    return user;
  }
}

module.exports = new ItemsRepository();