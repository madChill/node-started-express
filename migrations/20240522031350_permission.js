/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('permissions', table => {
          table.increments('id').primary()
          table.string('name')
          table.string('object')
          table.string('action')
          table.string('slug')
          table.string('description')
          table.timestamps(true, true)
        }).createTable('role_permissions', function(table) {
            table.increments('id').primary()
            table
              .integer('permission_id')
              .references('id')
              .inTable('permissions')
            table
              .integer('role_id')
              .references('id')
              .inTable('roles')
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
        knex.schema.dropTableIfExists('role_permissions'),
        knex.schema.dropTableIfExists('permissions'),
    ])
};
