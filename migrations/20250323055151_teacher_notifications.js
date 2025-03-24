/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // First create the main notifications table
  await knex.schema.createTable('teacher_notifications', (table) => {
    table.increments('id').primary();
    // Sender information (teacher/mentor)
    table
      .integer('sender_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .comment('Teacher/mentor who sent the notification');
    
    // Notification content
    table.string('title', 255).notNullable();
    table.text('message').notNullable();
    table.enum('type', ['announcement', 'assignment', 'reminder', 'feedback', 'other'])
      .defaultTo('announcement')
      .notNullable();
    
    // Priority level
    table.enum('priority', ['low', 'normal', 'high', 'urgent'])
      .defaultTo('normal')
      .notNullable();
    
    // Metadata
    table.jsonb('metadata').comment('Additional notification details');
    
    // Scheduling options
    table.datetime('scheduled_for')
      .comment('When the notification should be sent (null = immediate)');
    
    // Status tracking
    table.boolean('is_draft').defaultTo(false);
    table.boolean('is_sent').defaultTo(false);
    
    // Record keeping
    table.timestamps(true, true);
    
    // Indexes for faster lookups
    table.index('sender_id');
    table.index('type');
    table.index('is_sent');
    table.index('scheduled_for');
  });
  
  // Then create the recipients junction table
  await knex.schema.createTable('notification_recipients', (table) => {
    table.increments('id').primary();
    
    // References
    table
      .integer('notification_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('teacher_notifications')
      .onDelete('CASCADE');
    
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .comment('User who received the notification');
    
    // Status tracking
    table.boolean('is_read').defaultTo(false);
    table.datetime('read_at').nullable();
    table.boolean('is_starred').defaultTo(false);
    table.boolean('is_archived').defaultTo(false);
    
    // Timestamps
    table.timestamps(true, true);
    
    // Prevent duplicate entries
    table.unique(['notification_id', 'user_id']);
    
    // Indexes
    table.index('notification_id');
    table.index('user_id');
    table.index('is_read');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop tables in reverse order
  await knex.schema.dropTableIfExists('notification_recipients');
  await knex.schema.dropTableIfExists('teacher_notifications');
};