const mongoose = require('mongoose');
const logger = require('./logger');
const { mongoUri, env } = require('./const');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose.connect(mongoUri, {
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
  }).catch((err) => {
    logger.error(`MongoDB connection error: ${err}`);
  });
  return mongoose.connection;
};
