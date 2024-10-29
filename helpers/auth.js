const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  const token = req?.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(404).json({ error: "User not found." });
    }
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(400).json({
      message: "Invalid Token",
    });
  }
});

module.exports = authMiddleware;
