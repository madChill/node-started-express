const express = require('express');

const controller = require('./user.controller');
const { authorize, authBlockedUser } = require('../../middlewares/middware.auth.service');
const {
  updateUser,
  updatePassword,
} = require('../validations/user.validation.service');
const { validate } = require('../../middlewares/middware.validation.service');

const router = express.Router();

router
  .route('/')
  .get(authorize(), controller.loggedIn)

router
  .route('/password')
  .put(authorize(), validate(updatePassword), controller.updatePassword);

module.exports = router;
