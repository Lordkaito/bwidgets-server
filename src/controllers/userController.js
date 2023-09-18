const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

async function signUpUser(req, res) {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).send("El usuario ya existe.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(username, hashedPassword, email);
    // remember to remove the password from the response
    res.status(201).json({ message: "Usuario creado con éxito.", user });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).send("Error al crear el usuario.");
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).send("El usuario no existe.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Contraseña incorrecta.");
    }

    // need to receive token to check if user is logged in
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "48h",
      }
    );
    // remember to remove the password from the response
    res.status(202).send({ message: "Inicio de sesión correcto.", token });
  } catch (error) {
    res.status(500).send("Error al iniciar sesión.");
  }
}

module.exports = {
  signUpUser,
  loginUser,
};
