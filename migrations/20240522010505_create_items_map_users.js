/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('items', table => {
          table.increments('id').primary()
          table.string('name')
          table.string('picture')
          table.jsonb('meta')
          table.timestamps(true, true)
        }).createTable('user_items', function(table) {
            table.increments('id').primary()
            table
              .integer('item_id')
              .references('id')
              .inTable('items')
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
            .dropTableIfExists('user_items')
            .dropTableIfExists('items')
                .catch(err => {
                    console.error(err)
                    throw err
                })
    ])
};
