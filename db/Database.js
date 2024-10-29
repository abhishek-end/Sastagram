const { default: mongoose, model } = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_SECRET_KEY);
    console.log("Database Connection Established ");
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDb;
