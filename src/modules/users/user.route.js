const express = require('express');

const config = require('../../config/const');
const UsersController = require('./user.controller');
const { authorize } = require('../../middlewares/middware.auth.service'); // authBlockedUser
const UsersValidateService = require('../validations/user.validation.service');
const { validate } = require('../../middlewares/middware.validation.service');
const MiddwareAuthService = require('../../middlewares/middware.authz.service');

const router = express.Router();
const controller = new UsersController();

router
  .route('/register')
  // .get(authorize(), controller.loggedIn)
  .post(authorize(), MiddwareAuthService.authzHasPermission(MiddwareAuthService.permissions.registration.create),
    validate(UsersValidateService.registerStudents), controller.registerStudent);

router.route('/commonstudents').get(authorize()
  , MiddwareAuthService.authzHasPermission(MiddwareAuthService.permissions.registration.read)
  , validate(UsersValidateService.commonStudents)
  , controller.commonStudents);
  
router.route('/suspend').post(authorize()
  , MiddwareAuthService.authzHasPermission(MiddwareAuthService.permissions.registration.update)
  , validate(UsersValidateService.suspendStudents)
  , controller.suspendStudents);

router.route('/retrievefornotifications').post(authorize()
  , MiddwareAuthService.authzHasPermission(MiddwareAuthService.permissions.registration.read)
  , validate(UsersValidateService.retrieveForNotifications)
  , controller.retrieveForNotifications);

router
  .route('/password')
  .put(authorize(), validate(UsersValidateService.updatePassword), controller.updatePassword);

module.exports = router;
