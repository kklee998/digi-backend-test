exports.up = (knex) => knex.schema.createTable('users', (t) => {
  t.uuid('id').primary();
  t.string('password');
  t.string('name').unique();
  t.string('email').unique();
});

exports.down = (knex) => knex.schema.dropTableIfExists('users');
