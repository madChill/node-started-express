// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

this.dbHost = process.env.DB_HOST
    this.dbName = process.env.DB_NAME
    this.dbUser = process.env.DB_USER
    this.dbPass = process.env.DB_PASS

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
