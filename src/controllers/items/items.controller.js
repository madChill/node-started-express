
const APIError = require('../../utils/APIError');
const Items = require('../../models/items.model');

exports.getNotes = async (req, res, next) => {
  try {
    return res.json({
      note: 'ok'
    });
  } catch (error) {
    return next(error);
  }
};
exports.addItems = async (req, res, next) => {
  try {
    const newItem = req.body;

    // Insert the new item into the database
    const insertedItem = await Items.query().insert(newItem);

    return res.status(201).json(insertedItem);
  } catch (error) {
    return next(error);
  }
};
exports.getItems = async (req, res, next) => {
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
exports.addGifCode = async (req, res, next) => {
  try {
    return res.json({
      val:  "this is gifCode"
    });
  } catch (error) {
    return next(error);
  }
};
exports.gifCode = async (req, res, next) => {
  try {
    return res.json({
      val:  "this is gifCode"
    });
  } catch (error) {
    return next(error);
  }
};
