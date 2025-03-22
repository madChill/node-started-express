
import { Op } from 'sequelize';
// const APIError = require('../../utils/APIError.service');
const ItemsRepository = require('./items.repository');

class ItemsService {
  constructor() { }
  addItems = async (newItem) => {
    return await ItemsRepository.create(newItem);
  };
  getItems = async ({ page = 1, limit = 10, sort = null, search = null } = {}) => {
    const offset = page && limit ? (page - 1) * limit : 0;
    const order = sort ? [[sort.field, sort.order]] : [['created_at', 'DESC']];
    const where = search ? { name: { [Op.like]: `%${search}%` } } : undefined;
    const { count, rows: items } = await ItemsRepository.findAndCountAll({ offset, limit, order, where });
    return { total: count, items };
  }
};
module.exports = new ItemsService();

