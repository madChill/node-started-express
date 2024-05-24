const express = require('express');
const UserModule = require('../../modules/users');
const AuthModule = require('../../modules/auth');
const ItemsModule = require('../../modules/items');

const router = express.Router({ strict: false });
router.get('/users/status', (req, res) => res.send('OK'));

router.use('/user', UserModule.router);
router.use('/auth', AuthModule.router);
router.use('/items', ItemsModule.router);

router.use((req, res, next) => {
  next({
      status: 404,
      message: 'Not Found',
  });
});

module.exports = router;
