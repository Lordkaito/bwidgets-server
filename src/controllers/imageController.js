const Image = require("../models/image");

async function uploadImage(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No se ha subido ninguna imagen." });
  }
  // return
  // const image = req.file;
  // const filename = image.filename;
  // const mimetype = image.mimetype;
  // const size = image.size;
  const folderId = req.body.folder_id;
  try {
    const imagesPromises = await req.files.map(async (file) => {
      let filename = file.filename;
      let mimetype = file.mimetype;
      let size = file.size;
      let newImage = await Image.create({ filename, mimetype, size }, folderId);
      return newImage;
    });
    const images = await Promise.all(imagesPromises);
    res.status(201).json({ message: "Imagen subida con éxito.", images });
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
