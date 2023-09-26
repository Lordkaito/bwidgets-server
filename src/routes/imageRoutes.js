// imageRoutes.js
const express = require("express");
const {
  uploadImage,
  getImage,
  getAllImages,
} = require("../controllers/imageController");

const router = express.Router();

function setImageRoutes(app, upload) {
  // Ruta para subir una imagen
  router.post("/images", upload.array("image", 10), uploadImage);

  // Ruta para obtener una imagen por ID
  router.get("/images/:id", getImage);

  router.get("/", (req, res) => {
    res.send("API funcionandoasdfasdfa");
  });

  router.get("/images", getAllImages);

  router.get("/test", (req, res) => {
    res.send("API probando tests");
  });

  // Monta las rutas en la aplicación
  app.use("/api", router);
}

module.exports = {
  setImageRoutes,
};
