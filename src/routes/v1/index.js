const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const managerRoutes = require('./manager.route');

const router = express.Router({ strict: false });
router.get('/users/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
// if (env !== 'production') {
//   const useSchema = schema => (...args) => swaggerUi.setup(schema)(...args);

//   router.use('/api-docs', basicAuth({
//     users: {
//       [swaggerUser]: swaggerPassword,
//     },
//     challenge: true,
//   }), swaggerUi.serve, useSchema(swaggerDocument));
// }
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/manager', managerRoutes);

router.use((req, res, next) => {
  next({
      status: 404,
      message: 'Not Found',
  });
});

module.exports = router;
