const express = require('express');
const controller = require('../../controllers/auth/auth.controller');

const { validate } = require('../../middlewares/validation');

const {
  login,
  register,
  checkUser,
} = require('../../validations/auth.validation');

const router = express.Router();

router.route('/register')
  .post(validate(register), controller.register);

router.route('/login')
  .post(validate(login), controller.login);

router.route('/check')
  .post(validate(checkUser), controller.checkUser);

module.exports = router;
