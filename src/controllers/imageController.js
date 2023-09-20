const Image = require("../models/image");

function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).send("No se ha subido ninguna imagen.");
  }
  const image = req.file;
  const filename = image.filename;
  const mimetype = image.mimetype;
  const size = image.size;
  try {
    Image.create(filename, mimetype, size, folderId = 1);
    res.status(201).send("Imagen subida correctamente.");
  } catch (error) {
    console.error("Error al registrar la imagen en la base de datos:", error);
    res.status(500).send("Error al procesar la imagen.");
  }
}

function getImage(req, res) {
  const { id } = req.params;
  try {
    Image.findById(id).then((image) => {
      if (!image) {
        return res.status(404).send("No se ha encontrado ninguna imagen.");
      }
      res.json(image);
    });
  } catch (error) {
    console.error("Error al obtener la imagen de la base de datos:", error);
    res.status(500).send("Error al obtener la imagen.");
  }
}

function getAllImages(req, res) {
  // Consulta SQL para seleccionar todas las imágenes
  try {
    Image.findAll().then((images) => {
      if (!images) {
        return res.status(404).send("No se ha encontrado ninguna imagen.");
      }
      res.status(200).json(images);
    });
  } catch (error) {
    console.error("Error al obtener las imágenes de la base de datos:", error);
    res.status(500).send("Error al obtener las imágenes.");
  }
}

module.exports = {
  uploadImage,
  getImage,
  getAllImages,
};
