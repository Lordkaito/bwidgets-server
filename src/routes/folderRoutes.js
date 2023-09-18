// imageRoutes.js
const express = require("express");
const {
  createFolder,
  getFolder,
  getAllFolders,
} = require("../controllers/folderController");

const router = express.Router();

function setFolderRoutes(app, upload) {
  // Ruta para subir una imagen
  router.post("/folder", createFolder);

  // Ruta para obtener una imagen por ID
  router.get("/folder/:id", getFolder);

  router.get("/", (req, res) => {
    res.send("API funcionandoasdfasdfa");
  });

  router.get("/folders", getAllFolders);

  router.get("/folderstest", (req, res) => {
    res.send("folders route for tests");
  });

  // Monta las rutas en la aplicación
  app.use("/api", router);
}

module.exports = {
  setFolderRoutes,
};
