/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('users', table => {
          table.increments('id').primary()
          table.string('email')
          table.string('password')
          table.string('first_name')
          table.string('gender')
          table.string('phone_number')
          table.string('role')
          table.jsonb('device')
          table.date('dob')
          table.timestamps(true, true)
        })
      ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');  
};
