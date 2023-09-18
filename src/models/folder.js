const { Pool } = require("pg");

class Folder {
  constructor(name) {
    this.id = id;
    this.name = name;
  }

  static async create() {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        sslmode: "require",
      },
    });
    const client = await pool.connect();
    try {
      const result = await client
        .query("INSERT INTO folders(name) VALUES($1) RETURNING id", [name])
        .then((data) => {
          console.log("Carpeta creada en la base de datos con ID:", data);
          const folder = {
            id: data.rows[0].id,
            name: data.rows[0].name,
          };
          return folder;
        });
      const { id, name } = result;
      return new Folder(id, name);
    } catch (error) {
      throw new Error("Error al crear la carpeta" + error.message);
    }
  }

  static async find() {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        sslmode: "require",
      },
    });
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM folders WHERE id = $1", [
        id,
      ]);
      const { id, name } = result.rows[0];
      return new Folder(id, name);
    } catch (error) {
      throw new Error("Error al buscar la carpeta" + error.message);
    }
  }

  static async findAll() {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        sslmode: "require",
      },
    });
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM folders");
      return result.rows;
    } catch (error) {
      throw new Error("Error al buscar las carpetas" + error.message);
    }
  }
}

module.exports = Folder;
