const express = require('express');
const controller = require('../../controllers/items/items.controller');

const { validate } = require('../../middlewares/validation');
const { authorize } = require('../../middlewares/auth');
const authz = require('../../middlewares/authz');

const router = express.Router();

router.route('/gif-code')
  .post(authorize(), authz.authzAdmin('gif', 'write'), controller.addGifCode)
  .get(authorize(), authz.authzManager('gif', 'read'), controller.gifCode);
module.exports = router;
