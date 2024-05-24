const httpStatus = require('http-status');
const AuthService = require('./auth.service');


class AuthController {
  /**
 * Returns jwt token if registration was successful
 * @public
 */
  register = async (req, res, next) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(httpStatus.CREATED);
      return res.json(user);
    } catch (error) {
      console.log(error, "auth")
      return next(error);
    }
  };
  
  login = async (req, res, next) => {
    try {
      const {
        email,
        password,
      } = req.body;
      const auth = await AuthService.login({ email, password });
      return res.json(auth);
    } catch (error) {
      console.log(error, "auth")
      return next(error);
    }
  };

}
module.exports = new AuthController()

