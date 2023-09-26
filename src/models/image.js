const { Pool } = require("pg");
const checkName = require("../utils/checkName");

class Image {
  constructor(id, filename, url, folder) {
    this.image_id = id;
    this.image_filename = filename;
    this.image_url = url;
    this.folder_id = folder;
  }

  static async create(imageData, folderId) {
    const cleanImageName = checkName(imageData.filename);
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
      const imageUrl = `/uploads/${cleanImageName}`;
      const result = await client
        .query(
          "INSERT INTO images(filename, mimetype, size, folder_id, url) VALUES($1, $2, $3, $4, $5) RETURNING id",
          [cleanImageName, imageData.mimetype, imageData.size, folderId, imageUrl]
        )
        .then((data) => {
          const image = {
            id: data.rows[0].id,
            filename: cleanImageName,
            mimetype: imageData.mimetype,
            size: imageData.size,
            url: imageUrl, // Ajusta la ruta según tu configuración
            folderId: folderId, // Establece la carpeta asociada a la imagen
          };
          return image;
        });
      const { id, filename, url } = result;
      const folder = result.folderId
      return new Image(id, filename, url, folder);
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
