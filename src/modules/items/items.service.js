
const APIError = require('../../utils/APIError');
const ItemsRepository = require('./items.repository');

class ItemsService {
  constructor() { }
  addItems = async (newItem) => {
    try {
      return await ItemsRepository.create(newItem);
    } catch (error) {
      throw error
    }
  };
  getItems = async ({ page = 1, limit = 10, sort = null, search = null } = {}) => {
    const offset = page && limit ? (page - 1) * limit : 0;
    const order = sort ? [[sort.field, sort.order]] : [['created_at', 'DESC']];
    const where = search ? { name: { [Op.like]: `%${search}%` } } : undefined;
    try {
      const { count, rows: items } = await ItemsRepository.findAndCountAll({ offset, limit, order, where });
      return { total: count, items };
    } catch (error) {
      throw error;
    }
  };
}
module.exports  = new ItemsService();

