// const httpStatus = require('http-status');
const UserServices = require('./user.service');
class UsersController {
  constructor(){}
  loggedIn = async (req, res, next) => {
    try {
      const user = await UserServices.getUserData(req.user);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  };
  updatePassword = async (req, res, next) => {
    const response = UserServices.updatePassword(req.body);
    return res.json(response);
  };
}
module.exports = new UsersController()

