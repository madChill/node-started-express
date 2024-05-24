const express = require('express');
const controller = require('./items.controller');

const { validate } = require('../middlewares/middware.validation.service');
const { authorize } = require('../middlewares/middware.auth.service');
const authz = require('../middlewares/middware.authz.service');
const { items } = require('../validations/items.validation.service');
const router = express.Router();

router.route('/')
  .post(authorize(), authz.authzHasPermission('items', 'create'), validate(items), controller.addItems)
  .get(authorize(), authz.authzHasPermission('items', 'read'), controller.getItems);

module.exports = router;
