/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('registration_students');
  
  if (!exists) {
    return knex.schema.createTable('registration_students', (table) => {
      table.increments('id').primary();
      // Student reference (self-join to users)
      table
        .integer('student_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .comment('Reference to the student user');
      
      // Teacher/mentor reference (self-join to users)
      table
        .integer('teacher_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .comment('Reference to the teacher/mentor user');
      
      // Metadata fields
      table.enum('status', ['pending', 'approved', 'suspend']).defaultTo('pending');
      table.date('registration_date').notNullable().defaultTo(knex.raw('(CURRENT_DATE())'));
      table.date('start_date');
      table.date('end_date');
      table.jsonb('metadata').comment('Additional registration details');
      
      // Create indexes for better performance
      table.index('student_id');
      table.index('teacher_id');
      table.index(['student_id', 'teacher_id']);
      table.index('status');
      // Ensure a student can only be registered once with a specific teacher
      table.unique(['student_id', 'teacher_id']);
      // Timestamps for record keeping
      table.timestamps(true, true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('registration_students');
};