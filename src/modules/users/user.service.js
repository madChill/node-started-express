const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { get, forEach, pick, map } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const RegistrationService = require('../registrations/registration.service');
const APIError = require('../../utils/APIError.service');
const Roles = require('../roles/roles.model');
const Permission = require('../permissions/permissions.model');
const UserRepository = require('./user.repository');

class UserService {
  instance = null;
  constructor() {
    this.registrationService = new RegistrationService();
    if (!UserService.instance) {
      UserService.instance = this;
    }
    return UserService.instance;
  }
  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  bulkCreateStudents = async (users) => {
    if (!users || users.length === 0) {
      throw new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'students',
          location: 'auth',
          messages: ['Students list is empty'],
        }],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    return await UserRepository.bulkCreate(users.map(item => ({ email: item.email, role: 'student' })));
  }
  registerStudentsWithTeacher = async ({ teacher, students }) => {
    let teacher_data = await UserRepository.findByEmail(teacher);
    if (!teacher_data) {
      throw new APIError({
        message: 'Teacher not found',
        errors: ['teacher_not_found'],
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
    }
    // check the students are list exsited
    let students_data = await UserRepository.findByEmails(students);
    if (students_data.length !== students.length) {
      // update or create a new students
      const students_existed = students_data.map(item => item.email);
      const students_not_existed = students.filter(item => !students_existed.includes(item));
      const new_students = await this.bulkCreateStudents(students_not_existed.map(item => ({ email: item })));
      students_data = students_data.concat(new_students);
    }

    const teacher_id = teacher_data.dataValues.id;
    const students_id = students_data.map(item => item.dataValues.id);
    // findExistingRegistrations
    const existingRegistrations = await this.registrationService.findExistingRegistrations(teacher_id, students_id);
    if (existingRegistrations.length > 0) {
      throw new APIError({
        message: 'Students are already registered with this teacher',
        errors: [{
          field: 'students',
          location: 'auth',
          messages: ['Students are already registered with this teacher'],
        }],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    
    return await this.registrationService.registerStudentsWithTeacher({
      teacher_id: teacher_id,
      students_id: students_id,
      options: { status: 'approved' }
    });
  };

  getCommonStudents = async (teachers_list, students_existed=[]) => {
    const students = await UserRepository.getCommonStudents(teachers_list, students_existed);
    return {
      students: map(students, 'email')
    };
  }

  suspendStudent = async (teacher_id ,student_email) => {
    const student_data = await UserRepository.findByEmail(student_email);
    if (!student_data) {
      throw new APIError({
        message: 'Student not found',
        errors: ['student_not_found'],
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
    }
    const student_id = student_data.dataValues.id;
    return await this.registrationService.suspendStudent(student_id, teacher_id, 'suspend');
  }

  retrieveForNotifications = async ({ teacher, notification }) => {
    const teacher_data = await UserRepository.findByEmail(teacher);
    if (!teacher_data) {
      throw new APIError({
        message: 'Teacher not found',   
        errors: ['teacher_not_found'],
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
    }
    const students = notification.match(/@(\S*)/g).map(item => item.replace('@', '')); // students_existed
    const students_from_teacher = await this.getCommonStudents([teacher], students);
    return {
      recipients: students.concat(students_from_teacher.students)
    };
  }

  getUserByEmail = async (email) => {
    const user = await UserRepository.findByEmail(email);
    return user;
  }
  getUserData = async (user) => {
    const userData = this.transform(user);
    const attributions = await UserRepository.findById(user.id, {
      include: [
        {
          model: Roles,
          as: 'roles',
          include: [
            {
              model: Permission,
              as: 'permissions'
            }
          ]
        }
      ]
    })
    let permissions = []
    forEach(attributions.get({ plain: true }).roles, item => {
      permissions = permissions.concat(get(item, 'permissions', []))
    })
    userData.permissions = permissions;
    return userData;
  };
  loggedIn = async (req, res, next) => {
    try {
      const user = await this.getUserData(req.user, req.headers);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };
  updatePassword = async ({ password, currentPassword }, { user }) => {
    if (!await bcrypt.compare(currentPassword, user.password)) {
      throw new APIError({
        message: 'Password is incorrect',
        errors: ['invalid_credentials'],
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      });
    }

    return await UserRepository.update(user.id, { password: await bcrypt.hash(password, 10) });

  };
  transform(user) {
    const userData = pick(user, ['id', 'uuid', 'email', 'firstName', 'lastName', 'role',
      'gender', 'dob', 'phoneNumber'
    ]);
    return userData;
  }
  create = async (userInput) => {
    const password = userInput.password || uuidv4();
    const userData = this.transform(userInput);
    const { dob } = userData;
    const age = moment().endOf('year').diff(dob, 'years');
    if (age < 18) {
      throw new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'dob',
          location: 'auth',
          messages: ['Not old enough to register'],
        }],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    let userDuplicated = await this.getUserByEmail(userData.email);
    if (userDuplicated) {
      throw new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'auth',
          messages: ['Email existed'],
        }],
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    userData.password = await bcrypt.hash(password, 10);
    userData.email = userData.email.toLowerCase();
    return await UserRepository.create(userData);
  }
}

module.exports = new UserService()