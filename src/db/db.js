const pgp = require("pg-promise")();

// Configura la cadena de conexión a tu base de datos PostgreSQL
const dbConfig = {
  host:
    process.env.DB_HOST || "ep-young-mouse-14170166.eu-central-1.aws.neon.tech", // Cambia 'localhost' si es necesario
  port: process.env.DB_PORT || 5432, // Cambia 5432 si es necesario
  database: process.env.DB_DATABASE || "bwidgetsDB", // Cambia 'nombre_de_la_basededatos'
  user: process.env.DB_USER || "fl0user", // Cambia 'tu_usuario'
  password: process.env.DB_PASSWORD || "jNpUeCwIoR08", // Cambia 'tu_contraseña'
  ssl: {
    // rejectUnauthorized: false,
    sslmode: "require",
  },
};

// Crea una instancia de conexión a la base de datos
const db = pgp(dbConfig);

// crea las tablas si no existen
db.none(
  "CREATE TABLE IF NOT EXISTS images (id SERIAL PRIMARY KEY, filename VARCHAR(255) NOT NULL, mimetype VARCHAR(255) NOT NULL, size INTEGER NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
);

module.exports = db;
