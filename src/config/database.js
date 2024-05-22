const Knex = require('knex');
const { pgConnectionUri } = require('./const');

exports.knex = Knex({
  client: 'postgresql',
  connection: pgConnectionUri,
  pool: {
    min: 2,
    max: 30,
  },
});
