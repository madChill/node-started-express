// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const Env = require('./src/config/const')
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: Env.dbHost,
      database: Env.dbName,
      user: Env.dbUser,
      password: Env.dbPass,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: Env.dbConnectionUri,
    pool: {
      min: 2,
      max: 30
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
