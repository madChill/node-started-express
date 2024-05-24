const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const { Model } = require('objection');
const { knex } = require('./config/database');
const routes = require('./routes/v1');
const strategies = require('./modules/middlewares/passport.service');
const error = require('./modules/middlewares/middware.error.service');

// Give the knex object to objection.
Model.knex(knex);

/**
 * Express instance
 * @public
 */
const app = express();


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

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
// passport.use('client', strategies.client);

// mount api v1 routes
app.use('', routes);
// if error is not an instanceOf APIError, convert it.
app.use(error.converter);
// catch 404 and forward to error handler
app.use(error.notFound);

const server = http.Server(app);

module.exports = server;
