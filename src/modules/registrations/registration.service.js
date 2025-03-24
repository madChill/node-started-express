const registrationsRepository = require('./registrations.repository');
const userRepository = require('../users/user.repository');
const APIError = require('../../utils/APIError.service');
const httpStatus = require('http-status');

class RegistrationService {
  instance = null;
  constructor() {
    if (!RegistrationService.instance) {
      RegistrationService.instance = this;
    }
    return RegistrationService.instance;
  }
  getInstances() {
    if (!RegistrationService.instance) {
      RegistrationService.instance = new RegistrationService();
    }
    return RegistrationService.instance;
  }

  /**
   * Create a new registration
   * @param {Object} registrationData Registration data
   * @returns {Promise<Object>} Created registration
   */
  async createRegistration(registrationData) {
    // Validate student exists
    const student = await userRepository.findById(registrationData.student_id);
    if (!student) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Student not found');
    }

    // Validate teacher exists
    const teacher = await userRepository.findById(registrationData.teacher_id);
    if (!teacher) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Teacher not found');
    }

    // Check if this registration already exists
    const canRegister = await registrationsRepository.canRegister(
      registrationData.student_id,
      registrationData.teacher_id
    );

    if (!canRegister) {
      throw new APIError(
        httpStatus.CONFLICT,
        'Student is already registered with this teacher'
      );
    }

    return registrationsRepository.create(registrationData);
  }

  /**
   * Get registration by id
   * @param {Number} id Registration id
   * @returns {Promise<Object>} Registration data
   */
  async getRegistrationById(id) {
    const registration = await registrationsRepository.findById(id);
    if (!registration) {
      throw new APIError(httpStatus.NOT_FOUND, 'Registration not found');
    }
    return registration;
  }

  async findExistingRegistrations(teacher_id, student_ids) {
    return registrationsRepository.findExistingRegistrations(teacher_id, student_ids);
  }
  async registerStudentsWithTeacher({ teacher_id, students_id, options = {} }) {
    const data = students_id.map(student_id => ({
      student_id,
      teacher_id: teacher_id,
      ...options
    }));
    try {
      return registrationsRepository.createBulk(data);
    }
    catch (e) {
      console.error(e);
      throw new APIError(httpStatus.BAD_REQUEST, e.message);
    }
  }
  async suspendStudent(student_id, teacher_id) {
    return registrationsRepository.updateStatus(student_id, teacher_id, 'suspend');
  }

}

module.exports = RegistrationService;