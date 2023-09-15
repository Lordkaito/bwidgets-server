const db = require("../db/db");
const { Pool } = require("pg");

class User {
  constructor(id, username, password, email) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
  }

  static async create(user, userPassword, userEmail) {
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
          "INSERT INTO users(username, password, email) VALUES($1, $2, $3) RETURNING id",
          [user, userPassword, userEmail]
        )
        .then((data) => {
          console.log("Usuario registrado en la base de datos con ID:", data);
          const user = {
            id: data.rows[0].id,
            username: data.rows[0].username,
            email: data.rows[0].email,
          };
          return user;
        });
      const { id, username, email } = result;
      return new User(id, username, email);
    } catch (error) {
      throw new Error("Error al crear el usuario" + error.message);
    }
  }

  static async findByUsername(username) {
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
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (result.rowCount > 0) {
        const user = {
          id: result.rows[0].id,
          username: result.rows[0].username,
          password: result.rows[0].password,
          email: result.rows[0].email,
        };
        return new User(user.id, user.username, user.password, user.email);
      }
      return null;
    } catch (error) {
      throw new Error("Error al obtener el usuario" + " " + error.message);
    }
  }
}

module.exports = User;
