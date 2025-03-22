const DatabaseService = require('../../src/config/database');

const setupTestDB = () => {
  beforeAll(async () => {
    DatabaseService.instance.connect();
  });

  beforeEach(async () => {
    // await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    // await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
