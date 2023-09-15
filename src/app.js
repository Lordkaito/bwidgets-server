const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { setRoutes } = require("./routes/imageRoutes");
const dotenv = require("dotenv");
const upload = require('./utils/upload'); // Importa la configuración de Multer desde el archivo
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Rutas
setRoutes(app, upload);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use('/uploads', express.static('uploads'));

// Puerto
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
