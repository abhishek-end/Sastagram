const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "upload",
    format: async (req, file) => "jpeg",
    public_id: (req, file) => {
      const originalName = file.originalname.split(".")[0];
      return `${originalName}_${Date.now()}_${
        req.user?.id
      }`;
    },
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
