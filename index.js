const { port, env } = require('./src/config/const');
const logger = require('./src/config/logger');
const server = require('./src/index');

// listen to requests
server.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
 * Exports  express
 * @public
 */
module.exports = server;
