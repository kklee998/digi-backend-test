module.exports = {

  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'dev',
  },
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations',
  },
  useNullAsDefault: true,
};
