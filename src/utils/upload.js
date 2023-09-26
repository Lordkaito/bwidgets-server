const fs = require("fs");
const multer = require("multer");
// Set up multer middleware for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFileName = Date.now();
    if (fs.existsSync("uploads/" + file.originalname)) {
      cb(null, uniqueFileName + "-" + file.originalname);
    } else {
      cb(null, file.originalname);
    }
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
