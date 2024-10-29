const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = {
  register: asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    if (!username || !fullname || !email || !password) {
      throw new Error("Username email and password required");
    }
    //* check for existing user
    let user = await User.findOne({ $or: [({ email }, { username })] });
    if (user) {
      res.status(401).json("Email username is already registered");
    }
    //!hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      profile: {
        bio: "",
        profilePicture: "",
        website: "",
        gender,
      },
    });

    res.status(201).json({
      message: "User Register",
      user: { id: user._id, username: user.username, email: user.email },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("check you Username and password ");
    }

    let user = await User.findOne({ username });
    if (!user)
      throw new Error(`username ${username} or password is wrong 
    `);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    //send token into cookies
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
    //response send
    res.status(200).json({
      message: "Login Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  }),

  //for logout clear the cookies
  logout: asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Successfully" });
  }),

  //get profile
  profile: asyncHandler(async (req, res) => {
    const user = req.params.id;
    let profiler = await User.findById(user).select("-password");
    res.status(201).json({
      message: "profile fetched",
      profiler,
    });
  }),
  //edit profile
  updateProfile: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { gender, bio, website } = req.body; // Use req.body for updates

      const updatedUserProfile = await User.findByIdAndUpdate(
        userId,
        { gender, bio, website },
        { new: true, runValidators: true }
      );

      if (!updatedUserProfile) {
        return res.status(404).json({
          message: "User not found, could not update profile.",
        });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUserProfile,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the profile",
        error: error.message,
      });
    }
  }),
};

module.exports = userController;
