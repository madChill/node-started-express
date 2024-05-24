const express = require('express');
const controller = require('./auth.controller');
const MiddlewaresModule = require('../middlewares');

const ValidationsModule = require('../validations');
const router = express.Router();

router.route('/register')
  .post(MiddlewaresModule.MiddwareValidateService.validate(ValidationsModule.AuthValidateService.register), controller.register);

router.route('/login')
  .post(MiddlewaresModule.MiddwareValidateService.validate(ValidationsModule.AuthValidateService.login), controller.login);

module.exports = router;
