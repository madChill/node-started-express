const http = require('http');
const logger = require('./src/config/logger');
const app = require('./src/app');
const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const server = http.Server(app);
server.listen(port, () => logger.info(`server started on port ${port} (${env})`));
module.exports = server;
