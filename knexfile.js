const inProduction = process.env.NODE_ENV === 'production';
let DB_URL = process.env.DATABASE_URL;
if (DB_URL) {
  DB_URL = `${DB_URL}?ssl=true`;
} else {
  DB_URL = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'dev',
  };
}
module.exports = {

  client: 'pg',
  connection: DB_URL,
  ssl: !!inProduction,
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations',
  },
  useNullAsDefault: true,
};
