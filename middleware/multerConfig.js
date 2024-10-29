const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "upload",
    format: async (req, file) => "jpeg",
    public_id: (req, file) => file.originalname,
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
