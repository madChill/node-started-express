const ResponseService = require('../../utils/Response.service');
const UserServices = require('./user.service');
class UsersController {
  instance = null;
  static getInstance() {
    if (!this.instance) {
      this.instance = new UsersController();
    }
    return this.instance;
  }
  constructor() { 
    if (!UsersController.instance) {
      UsersController.instance = this;
    }
    return UsersController.instance;
  }
  
  registerStudent = async (req, res, next) => {
    try {
      const data = await UserServices.registerStudentsWithTeacher(req.body);
      const response = ResponseService.success(data);
      return res.status(response.statusCode).json();
    } catch (e) {
      next(e);
    }
  };
  commonStudents = async (req, res, next) => {
    try {
      const teacherParam = req.query.teacher;
      const teachers = Array.isArray(teacherParam) ? teacherParam : [teacherParam];
      const data = await UserServices.getCommonStudents(teachers);
      const response = ResponseService.success({data: data, statusCode: 200});
      return res.status(response.statusCode).json(data);
    } catch (e) {
      next(e);
    }
  };
  suspendStudents = async (req, res, next) => {
    try {
      // get jwt info
      const data = await UserServices.suspendStudent(req.user.id, req.body.student);
      const response = ResponseService.success(data);
      return res.status(response.statusCode).json();
    } catch (e) {
      next(e);
    }
  };

  retrieveForNotifications = async (req, res, next) => {
    try {
      const { teacher , notification } = req.body;
      const data = await UserServices.retrieveForNotifications({ teacher , notification });
      const response = ResponseService.success({ data: data, statusCode: 200 });
      return res.status(response.statusCode).json(data);
    } catch (e) {
      next(e);
    }
  }
  
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
module.exports = UsersController

