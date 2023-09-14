const { Pool } = require('pg');

class Image {
  constructor(id, filename, url) {
    this.id = id;
    this.filename = filename;
    this.url = url;
  }

  static async create(filename, url) {
    const pool = new Pool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO images (filename, url) VALUES ($1, $2) RETURNING id',
        [filename, url]
      );
      const id = result.rows[0].id;
      return new Image(id, filename, url);
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const pool = new Pool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM images WHERE id = $1',
        [id]
      );
      if (result.rows.length > 0) {
        const { id, filename, url } = result.rows[0];
        return new Image(id, filename, url);
      }
      return null;
    } finally {
      client.release();
    }
  }

  static async findAll() {
    const pool = new Pool();
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM images');
      return result.rows.map(row => new Image(row.id, row.filename, row.url));
    } finally {
      client.release();
    }
  }
}

module.exports = Image;