const http = require('http');
const Env = require('./src/config/const');
const logger = require('./src/config/logger');
const app = require('./src/app');

const { port, env } = Env
const server = http.Server(app);
server.listen(port, () => logger.info(`server started on port ${port} (${env})`));
module.exports = server;
