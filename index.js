const http = require('http');
const { port, env } = require('./src/config/const');
const logger = require('./src/config/logger');
const app = require('./src/app');

const server = http.Server(app);
server.listen(port, () => logger.info(`server started on port ${port} (${env})`));
module.exports = server;
