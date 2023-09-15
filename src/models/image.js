const { Pool } = require("pg");

class Image {
  constructor(id, filename, url) {
    this.id = id;
    this.filename = filename;
    this.url = url;
  }

  static async create(filename, mimetype, size) {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        // rejectUnauthorized: false,
        sslmode: "require",
      },
    });
    const client = await pool.connect();
    try {
      const result = await client
        .query(
          "INSERT INTO images(filename, mimetype, size) VALUES($1, $2, $3) RETURNING id"[
            (filename, mimetype, size)
          ]
        )
        .then((data) => {
          console.log(
            "Imagen subida y registrada en la base de datos con ID:",
            data.rows[0].id
          );
          const image = {
            id: data.rows[0].id,
            filename: filename,
            mimetype: mimetype,
            size: size,
            url: `/uploads/${filename}`, // Ajusta la ruta según tu configuración
          };
          return image;
        });
      const { id, filename, mimetype, size, url } = result;
      return new Image(id, filename, url);
    } catch (error) {
      console.error("Error al registrar la imagen en la base de datos:", error);
      res.status(500).send("Error al procesar la imagen.");
    } finally {
      client.release();
    }
  }

  static async findById(id) {
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
        .query("SELECT * FROM images WHERE id = $1", [id])
        .then((data) => {
          console.log(data);
          const image = {
            id: data.rows[0].id,
            filename: data.rows[0].filename,
            mimetype: data.rows[0].mimetype,
            size: data.rows[0].size,
            // Genera la URL pública basada en la ubicación de la imagen en el servidor
            url: `/uploads/${data.rows[0].filename}`, // Ajusta la ruta según tu configuración
          };
          return image;
        });
      if (result) {
        return new Image(result.id, result.filename, result.url);
      }
      return null;
    } finally {
      client.release();
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
        // rejectUnauthorized: false,
        sslmode: "require",
      },
    });
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM images");
      // return result.rows.map((row) => new Image(row.id, row.filename, row.url));
      const images = result.rows.map((row) => {
        return {
          id: row.id,
          filename: row.filename,
          mimetype: row.mimetype,
          size: row.size,
          // Genera la URL pública basada en la ubicación de la imagen en el servidor
          url: `/uploads/${row.filename}`, // Ajusta la ruta según tu configuración
        };
      });
      return images;
    } finally {
      client.release();
    }
  }
}

module.exports = Image;
