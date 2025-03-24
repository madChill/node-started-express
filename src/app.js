const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

import { rateLimit } from 'express-rate-limit'
const { Model } = require('objection');
const { knex } = require('./config/database');
const routes = require('./routes/v1');
const strategies = require('./middlewares/passport.service');
const error = require('./middlewares/middware.error.service');
const DatabaseService = require('./config/database');

DatabaseService.sequelize.authenticate()
.then(() => console.log('Database connected.'))
.catch(err => console.error('Unable to connect to the database:', err));

// Give the knex object to objection.
Model.knex(knex);

/**
 * Express instance
 * @public
 */
const app = express();
// Couple the application to the Swagger module.
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})
// Apply the rate limiting middleware to all requests.
app.use(limiter)

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

//app health check 
app.get('/status', (req, res) => {
	res.status(200).end();
});

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
// passport.use('client', strategies.client);

// mount api v1 routes
app.use('/api', routes);
// if error is not an instanceOf APIError, convert it.
app.use(error.converter);
// catch 404 and forward to error handler
app.use(error.notFound);

module.exports = app;
