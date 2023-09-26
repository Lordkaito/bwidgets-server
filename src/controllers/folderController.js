const Folder = require("../models/folder");

async function createFolder(req, res) {
  console.log("req.body", req.body);
  try {
    const { name } = req.body;
    const folder = await Folder.create(name);
    if (folder) {
      res.status(201).send({ message: "Carpeta creada correctamente.", folder });
    }
  } catch (error) {
    console.error("Error al crear la carpeta:", error);
    res.status(500).send("Error al crear la carpeta.");
  }
}

function getFolder(req, res) {
  const { id } = req.params;
  try {
    Folder.find(id).then((folder) => {
      if (folder.name === "No folder found") {
        return res
          .status(404)
          .send({ message: "No se ha encontrado ninguna carpeta." });
      }
      res.send({ message: "Carpeta encontrada.", folder: folder });
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
