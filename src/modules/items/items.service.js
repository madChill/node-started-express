
const APIError = require('../../utils/APIError');
const Items = require('./items.model');

class ItemsService {
  constructor() { }
  addItems = async (newItem) => {
    try {
      return await Items.query().insert(newItem);
    } catch (error) {
      throw error
    }
  };
  getItems = async (req, res, next) => {
    try {
      const page = req.query.page || 0; // Default to page 0 if no page query parameter is provided
      const pageSize = 10; // Set the page size

      // Fetch the items for the requested page
      const items = await Items.query().page(page, pageSize);

      return res.json(items);
    } catch (error) {
      return next(error);
    }
  };
}
module.exports  = new ItemsService();

