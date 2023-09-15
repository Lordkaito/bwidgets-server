// userRoutes.js
const express = require("express");
const { signUpUser, loginUser } = require("../controllers/userController");

const router = express.Router();

function setUserRoutes(app) {
  // Ruta para iniciar sesión
  router.post("/login", loginUser);

  // Ruta para crear un usuario
  router.post("/signup", signUpUser);

  router.get("/usertest", (req, res) => {
    res.send("API probando tests for user");
  });

  // Monta las rutas en la aplicación
  app.use("/user", router);
}

module.exports = {
  setUserRoutes,
};
