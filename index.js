console.log(":: Shree Ganeshay namah ::");
const express = require("express");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { connectDb } = require("./config/database");
const userRoutes = require("./routes/user");

// 2) App Config
const PORT = process.env.PORT || 4000;

// 3) Database Connection
connectDb();

// 4) Middlewares
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// 5) Routes
app.use("/api/v1/auth", userRoutes);
app.get("/", (req, res) => {
  res.send("You're going very well...");
});

// 6) Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
