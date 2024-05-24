/* eslint-disable no-param-reassign */

const ItemsService = require('./items.service');

class ItemsController {
  addItems = async (req, res, next) => {
    try {
      const insertedItem = await ItemsService.addItems(req.body);
      return res.status(201).json(insertedItem);
    } catch (error) {
      return next(error);
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

module.exports = new ItemsController();
