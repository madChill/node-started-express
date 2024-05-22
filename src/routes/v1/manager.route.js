const express = require('express');
const controller = require('../../controllers/items/items.controller');

const { validate } = require('../../middlewares/validation');
const { authorize } = require('../../middlewares/auth');
const authz = require('../../middlewares/authz');
const { items } = require('../../validations/items.validation');
const router = express.Router();

router.route('/items')
  .post(authorize(), authz.authzHasPermission('items', 'create'), validate(items), controller.addItems)
  .get(authorize(), authz.authzHasPermission('items', 'read'), controller.getItems);

router.route('/gif-code')
  .post(authorize(), authz.authzAdmin('gif', 'create'), controller.addGifCode)
  .get(authorize(), authz.authzManager('gif', 'read'), controller.gifCode);
module.exports = router;
