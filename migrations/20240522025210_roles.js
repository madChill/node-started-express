/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('roles', table => {
          table.increments('id').primary()
          table.string('name')
          table.string('slug')
          table.string('description')
          table.timestamps(true, true)
        }).createTable('user_roles', function(table) {
            table.increments('id').primary()
            table
              .integer('role_id')
              .references('id')
              .inTable('roles')
            table
              .integer('user_id')
              .references('id')
              .inTable('users')
            table
              .jsonb('meta')
          })
      ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return Promise.all([
        knex.schema
            .dropTableIfExists('user_roles')
            .dropTableIfExists('roles')
                .catch(err => {
                    console.error(err)
                    throw err
                })
    ])
};
