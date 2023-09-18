const Folder = require("../models/folder");

function createFolder(req, res) {
  const { name } = req.body;
  try {
    Folder.create(name);
    res.status(201).send("Carpeta creada correctamente.");
  } catch (error) {
    console.error("Error al crear la carpeta:", error);
    res.status(500).send("Error al crear la carpeta.");
  }
}

function getFolder(req, res) {
  const { id } = req.params;
  try {
    Folder.find(id).then((folder) => {
      if (!folder) {
        return res.status(404).send("No se ha encontrado ninguna carpeta.");
      }
      res.json(folder);
    });
  } catch (error) {
    console.error("Error al obtener la carpeta de la base de datos:", error);
    res.status(500).send("Error al obtener la carpeta.");
  }
}

function getAllFolders(req, res) {
  try {
    Folder.findAll().then((folders) => {
      if (!folders) {
        return res.status(404).send("No se ha encontrado ninguna carpeta.");
      }
      res.json(folders);
    });
  } catch (error) {
    console.error("Error al obtener las carpetas de la base de datos:", error);
    res.status(500).send("Error al obtener las carpetas.");
  }
}

module.exports = {
  createFolder,
  getFolder,
  getAllFolders,
};
