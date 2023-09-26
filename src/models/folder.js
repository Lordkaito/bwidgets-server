const { Pool } = require("pg");
// const checkName = require("../utils/checkName");
class Folder {
  constructor(name, images) {
    // this.id = id;
    this.name = name;
    this.images = images;
  }

  static async create(folderName) {
    // const cleanName = checkName(folderName);
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
        .query("INSERT INTO folders(name) VALUES($1) RETURNING id", [
          folderName,
        ])
        .then((data) => {
          const folder = {
            id: data.rows[0].id,
            // name: folderName,
          };
          return folder;
        });
      const { name } = result;
      return new Folder(name);
    } catch (error) {
      throw new Error("Error al crear la carpeta" + error.message);
    }
  }

  static async find(folderId) {
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
      const result = await client.query(
        "SELECT images.id as image_id, images.filename as image_filename, images.url as image_url, folders.id as folder_id, folders.name as folder_name FROM images JOIN folders ON folders.id = images.folder_id WHERE folder_id = $1",
        [folderId]
      );

      if (result.rows.length === 0) {
        return new Folder("No folder found", null);
      }
      const { name } = result.rows[0];
      const images = result.rows;
      return new Folder(name, images);
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

  static async findImages(id) {
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
        .query("SELECT * FROM images WHERE folder_id = $1", [id])
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
}

module.exports = Folder;
