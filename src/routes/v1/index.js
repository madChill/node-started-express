const express = require('express');
const UserModule = require('../../modules/users');
const AuthModule = require('../../modules/auth');

const userModule = new UserModule();
const router = express.Router({ strict: false });
router.get('/users/status', (req, res) => res.send('OK'));

router.use('/', userModule.router);
router.use('/auth', AuthModule.router);

router.use((req, res, next) => {
  next({
      status: 404,
      message: 'Not Found',
  });
});

module.exports = router;
