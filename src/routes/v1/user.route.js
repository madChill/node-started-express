const express = require('express');

const controller = require('../../controllers/users/user.controller');
const { authorize, authBlockedUser } = require('../../middlewares/auth');
const {
  updateUser,
  updatePassword,
} = require('../../validations/users/user.validation');
const { validate } = require('../../middlewares/validation');

const router = express.Router();

router
  .route('/')
  .get(authBlockedUser(), controller.loggedIn)

router
  .route('/password')
  .put(authorize(), validate(updatePassword), controller.updatePassword);

module.exports = router;
