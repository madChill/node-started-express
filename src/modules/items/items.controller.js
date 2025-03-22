 

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
      const items = await ItemsService.getItems(req.query);
      return res.json(items);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ItemsController();
