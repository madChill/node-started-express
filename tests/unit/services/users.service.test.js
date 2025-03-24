const UserService = require('../../../src/modules/users/user.service');
const UserRepository = require('../../../src/modules/users/user.repository');
const APIError = require('../../../src/utils/APIError.service');
// Mock dependencies
jest.mock('../../../src/modules/users/user.repository');
jest.mock('../../../src/modules/registrations/registration.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            suspendStudent: jest.fn()
        };
    });
});
// Mock the UserService instance
const RegistrationService = require('../../../src/modules/registrations/registration.service');

describe('UserService', () => {
  let userService;
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    userService = UserService;
    // Mock the registration service instance that's created in the constructor
    userService.registrationService = new RegistrationService();
  });

  describe('suspendStudent', () => {
    it('should suspend a student successfully', async () => {
      // Mock data
      const teacherId = 1;
      const studentEmail = 'student@example.com';
      const studentId = 2;
      
      // Mock the student data returned by findByEmail
      UserRepository.findByEmail.mockResolvedValue({
        dataValues: { id: studentId }
      });
      
      userService.registrationService.suspendStudent.mockResolvedValue({
        success: true,
        message: 'Student suspended successfully'
      });
        // Call the function
      const result = await userService.suspendStudent(teacherId, studentEmail);
      // Assertions
      expect(result).toEqual({
        success: true,
        message: 'Student suspended successfully'
      });
    });

    it('should throw an error if student is not found', async () => {
      // Mock data
      const teacherId = 1;
      const studentEmail = 'nonexistent@example.com';
      
      // Mock student not found
      UserRepository.findByEmail.mockResolvedValue(null);
      
      // Assertions for thrown error
      await expect(userService.suspendStudent(teacherId, studentEmail))
        .rejects.toThrow(APIError);
      
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(studentEmail);
      expect(userService.registrationService.suspendStudent).not.toHaveBeenCalled();
    });
  });

  describe('retrieveForNotifications', () => {
    it('should retrieve recipients for notifications successfully', async () => {
      // Mock data
      const teacher = 'teacher@example.com';
      const notification = 'Hello @student1@example.com @student2@example.com';
      const teacherId = 1;
      
      // Mock teacher data
      UserRepository.findByEmail.mockResolvedValue({
        dataValues: { id: teacherId }
      });
      
      // Mock getCommonStudents result
      userService.getCommonStudents = jest.fn().mockResolvedValue({
        students: ['student3@example.com', 'student4@example.com']
      });
      
      // Call the function
      const result = await userService.retrieveForNotifications({ 
        teacher, 
        notification 
      });
      
      // Assertions
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(teacher);
      expect(userService.getCommonStudents).toHaveBeenCalledWith(
        [teacher], 
        ['student1@example.com', 'student2@example.com']
      );
      expect(result).toEqual({
        recipients: [
          'student1@example.com', 
          'student2@example.com',
          'student3@example.com',
          'student4@example.com'
        ]
      });
    });

    it('should handle notifications with no @mentions', async () => {
      // Mock data
      const teacher = 'teacher@example.com';
      const notification = 'Hello everyone';
      const teacherId = 1;
      
      // Mock teacher data
      UserRepository.findByEmail.mockResolvedValue({
        dataValues: { id: teacherId }
      });
      
      // This should throw an error when trying to match @mentions
      await expect(userService.retrieveForNotifications({ 
        teacher, 
        notification 
      })).rejects.toThrow();
      
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(teacher);
    });

    it('should throw an error if teacher is not found', async () => {
      // Mock data
      const teacher = 'nonexistent@example.com';
      const notification = 'Hello @student@example.com';
      
      // Mock teacher not found
      UserRepository.findByEmail.mockResolvedValue(null);
      
      // Assertions for thrown error
      await expect(userService.retrieveForNotifications({ 
        teacher, 
        notification 
      })).rejects.toThrow(APIError);
      
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(teacher);
      expect(userService.getCommonStudents).not.toHaveBeenCalled();
    });
  });

  describe('getCommonStudents', () => {
    it('should retrieve common students successfully', async () => {
      // Mock data
      const teachersList = ['teacher1@example.com', 'teacher2@example.com'];
      const studentsExisted = ['student1@example.com'];
      const mockStudents = [
        { email: 'student2@example.com' },
        { email: 'student3@example.com' }
      ];
      
      // Mock repository call
      UserRepository.getCommonStudents.mockResolvedValue(mockStudents);
      const result = await userService.getCommonStudents(teachersList, studentsExisted);
      expect(result).toEqual({
        students: ['student3@example.com', 'student4@example.com']
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should retrieve a user by email', async () => {
      // Mock data
      const email = 'user@example.com';
      const mockUser = { id: 1, email };
      
      // Mock repository call
      UserRepository.findByEmail.mockResolvedValue(mockUser);
      
      // Call the function
      const result = await userService.getUserByEmail(email);
      
      // Assertions
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });
  });
});