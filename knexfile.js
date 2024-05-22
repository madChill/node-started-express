// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { pgConnectionUri } = require('./src/config/const')
console.log(pgConnectionUri,"=pgConnectionUri");
module.exports = {
  development: {
    client: 'pg',
    connection: pgConnectionUri,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: pgConnectionUri,
    pool: {
      min: 2,
      max: 30
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
