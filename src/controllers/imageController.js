const fs = require("fs");
const path = require("path");
const db = require("../db/db");

function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).send("No se ha subido ninguna imagen.");
  }

  const image = req.file;
  const filename = image.filename;
  const mimetype = image.mimetype;
  const size = image.size;

  // Guarda la información de la imagen en la base de datos
  db.one(
    "INSERT INTO images(filename, mimetype, size) VALUES($1, $2, $3) RETURNING id",
    [filename, mimetype, size]
  )
    .then((data) => {
      console.log(
        "Imagen subida y registrada en la base de datos con ID:",
        data.id
      );
      res.send("Imagen subida y registrada en la base de datos.");
    })
    .catch((error) => {
      console.error("Error al registrar la imagen en la base de datos:", error);
      res.status(500).send("Error al procesar la imagen.");
    });
}

function getImage(req, res) {
  const { id } = req.params;
  db.one("SELECT * FROM images WHERE id = $1", [id])
    .then((data) => {
      const image = {
        id: data.id,
        filename: data.filename,
        mimetype: data.mimetype,
        size: data.size,
        // Genera la URL pública basada en la ubicación de la imagen en el servidor
        url: `/uploads/${data.filename}`, // Ajusta la ruta según tu configuración
      };

      res.json(image); // Envía la imagen con la URL pública
    })
    .catch((error) => {
      console.error("Error al obtener la imagen de la base de datos:", error);
      res.status(500).send("Error al obtener la imagen.");
    });
}

function getAllImages(req, res) {
  // Consulta SQL para seleccionar todas las imágenes
  db.any("SELECT * FROM images")
    .then((data) => {
      // Mapea los resultados para agregar URLs públicas a cada imagen
      const imagesWithPublicUrls = data.map((image) => {
        return {
          id: image.id,
          filename: image.filename,
          mimetype: image.mimetype,
          size: image.size,
          // Genera la URL pública basada en la ubicación de la imagen en el servidor
          url: `/uploads/${image.filename}`, // Ajusta la ruta según tu configuración
        };
      });

      res.json(imagesWithPublicUrls); // Envía todas las imágenes con URLs públicas
    })
    .catch((error) => {
      console.error(
        "Error al obtener las imágenes de la base de datos:",
        error
      );
      res.status(500).send("Error al obtener las imágenes.");
    });
}

module.exports = {
  uploadImage,
  getImage,
  getAllImages,
};
