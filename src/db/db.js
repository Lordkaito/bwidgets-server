const pgp = require("pg-promise")();

// Configura la cadena de conexión a tu base de datos PostgreSQL
const dbConfig = {
  host:
    process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  ssl: {
    // rejectUnauthorized: false,
    sslmode: "require",
  },
};

// Crea una instancia de conexión a la base de datos
const db = pgp(dbConfig);

// crea las tablas si no existen
// db.none(
//   "CREATE TABLE IF NOT EXISTS images (id SERIAL PRIMARY KEY, filename VARCHAR(255) NOT NULL, mimetype VARCHAR(255) NOT NULL, size INTEGER NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, user_id INTEGER NOT NULL)"
// );

// db.none(
//   "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
// );

module.exports = db;
