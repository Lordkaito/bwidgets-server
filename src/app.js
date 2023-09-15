const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { setImageRoutes } = require("./routes/imageRoutes");
const { setUserRoutes } = require("./routes/userRoutes");
const dotenv = require("dotenv");
const upload = require("./utils/upload"); // Importa la configuración de Multer desde el archivo
const fs = require("fs");
dotenv.config();
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Rutas
setImageRoutes(app, upload);
setUserRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.use("/uploads", express.static("uploads"));
// Puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
