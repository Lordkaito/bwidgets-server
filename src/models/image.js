const { Pool } = require("pg");

class Image {
  constructor(id, filename, url) {
    this.id = id;
    this.filename = filename;
    this.url = url;
    // this.folderId = folderId;
  }

  static async create(name, fileType, kb, folderId = null) {
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
        .query(
          "INSERT INTO images(filename, mimetype, size, folder_id) VALUES($1, $2, $3, $4) RETURNING id",
          [name, fileType, kb, folderId]
        )
        .then((data) => {
          console.log(
            "Imagen subida y registrada en la base de datos con ID:",
            data.rows[0].id
          );
          const image = {
            id: data.rows[0].id,
            filename: name,
            mimetype: fileType,
            size: kb,
            url: `/uploads/${name}`, // Ajusta la ruta según tu configuración
            folderId: folderId, // Establece la carpeta asociada a la imagen
          };
          return image;
        });
      const { id, filename, url } = result;
      return new Image(id, filename, url);
    } catch (error) {
      console.error("Error al registrar la imagen en la base de datos:", error);
      throw new Error("Error al registrar la imagen en la base de datos");
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
        sslmode: "require",
      },
    });
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM images");
      const images = result.rows.map((row) => {
        return {
          id: row.id,
          filename: row.filename,
          mimetype: row.mimetype,
          size: row.size,
          folderId: row.folder_id,
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
