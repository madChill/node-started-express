const { faker } = require('@faker-js/faker');
const userRepository = require('../../../src/modules/users/user.repository');

// Create a mock for the database models/ORM
jest.mock('../../../src/modules/users/user.model', () => {
  return {
    query: jest.fn().mockReturnThis(),
    findByPk: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    returning: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
  };
});

const UserModel = require('../../../src/modules/users/user.model');

describe('UserRepository', () => {
  let mockUser;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    const userModel = UserModel;
    // Initialize the repository
    // userRepository = new UserRepository();
    
    // Create a mock user object
    mockUser = {
      id: 10021,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'Password123',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  describe('findById', () => {
    test('should find a user by id', async () => {
      // Setup mock return value
      UserModel.findByPk.mockResolvedValue(mockUser);
      // Call the repository method
      const result = await userRepository.findById(mockUser.id);
      // Assert that the result is as expected
      expect(result).toEqual(mockUser);
    });
    
    test('should return null when user not found', async () => {
      UserModel.findByPk.mockResolvedValue(null);
      const result = await userRepository.findById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    test('should find a user by email', async () => {
      UserModel.where.mockReturnThis();
      UserModel.first.mockResolvedValue(mockUser);
      UserModel.findOne.mockResolvedValue(mockUser);
      const result = await userRepository.findByEmail(mockUser.email);
      expect(result).toEqual(mockUser);
    });
    
    test('should return null when email not found', async () => {
      UserModel.where.mockReturnThis();
      UserModel.first.mockResolvedValue(null);
      UserModel.findOne.mockResolvedValue(null);
      const result = await userRepository.findByEmail('test@example.com');
      expect(UserModel.findOne).toHaveBeenCalledWith({"where": {"email": "test@example.com"}});
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    test('should create a new user', async () => {
      // User data without id (as it would be generated)
      const userData = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        role: mockUser.role
      };
      
      const createdUser = { ...userData, id: mockUser.id };
      
      UserModel.create.mockResolvedValue(createdUser);
      // Call repository method
      const result = await userRepository.create(userData);

      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    test('should update an existing user', async () => {
      const updates = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };
      const updatedUser = {...mockUser, ...updates};
      // Setup mock
      UserModel.update.mockResolvedValue(updatedUser);
      const result = await userRepository.update(mockUser.id, updates);
      expect(result).toEqual(updatedUser);
    });
    
  });
});