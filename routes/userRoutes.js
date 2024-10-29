const express = require("express");
const userRoutes = express.Router();
const userController = require("../controller/useController");
const authMiddleware = require("../helpers/auth");
const upload = require("../middleware/multerConfig");

userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/logout", authMiddleware, userController.logout);
userRoutes.get("/profile/:id", authMiddleware, userController.profile);
userRoutes.patch("/profile/edit", authMiddleware, userController.updateProfile);
userRoutes.post(
  "/profile/upload",
  authMiddleware,
  upload.single("image"),
  userController.uploadImage
);
module.exports = userRoutes;
