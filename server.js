const express = require("express");
const app = express();
const connectDb = require("./db/Database");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//!Database connection
connectDb();
//!express parser
app.use(express.json());
//!cookie parser
app.use(cookieParser());
//!userRoutes
app.use("/", userRoutes);

//!Remove later (maybe)
app.get("/", (req, res) => {
  res.send("Server is running on localhost");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
