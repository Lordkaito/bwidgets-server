// imageRoutes.js
const express = require("express");
const {
  uploadImage,
  getImage,
  getAllImages,
} = require("../controllers/imageController");

const router = express.Router();

function setRoutes(app, upload) {
  // Ruta para subir una imagen
  router.post("/images", upload.single("image"), uploadImage);

  // Ruta para obtener una imagen por ID
  router.get("/images/:id", getImage);

  router.get("/", (req, res) => {
    res.send("API funcionandoasdfasdfa");
  });

  router.get("/images", getAllImages);

  router.get("/test", (req, res) => {
    res.send("API probando tests");
  });

  // Agrega más rutas aquí según tus necesidades

  // Monta las rutas en la aplicación
  app.use("/api", router);
}

module.exports = {
  setRoutes,
};
