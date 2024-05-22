
const APIError = require('../../utils/APIError');
exports.getNotes = async (req, res, next) => {
  try {
    return res.json({
      note: 'ok'
    });
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
