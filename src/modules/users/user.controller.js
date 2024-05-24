const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { get, map, forEach } = require('lodash');

const APIError = require('../../utils/APIError');
const User = require('./user.model');

/**
 * Get User's data
 * @public
 */
const getUserData = async (user) => {
  const userData = User.transform(user);
  const attributions = await User.query()
    .where('id', '=', user.id)
    .withGraphFetched('[roles.[permissions]]')  
    .first();
  let permissions = []
  forEach(attributions.roles, item => {
    permissions = permissions.concat(get(item, 'permissions', []))
  })

  userData.permissions = permissions;
  userData.attributions = (attributions && attributions.attributions) ? attributions.attributions : [];
  return userData;
};
exports.getUserData = getUserData

/**
 * Get logged in user's data
 * @public
 */
exports.loggedIn = async (req, res, next) => {
  try {
    const user = await getUserData(req.user, req.headers);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { password, currentPassword } = req.body;

    if (!await bcrypt.compare(currentPassword, req.user.password)) {
      throw new APIError({
        message: 'Password is incorrect',
        errors: ['invalid_credentials'],
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      });
    }

    await User.query()
      .patch({
        password: await bcrypt.hash(password, 10),
      })
      .where('id', '=', req.user.id)
      .first();

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};
