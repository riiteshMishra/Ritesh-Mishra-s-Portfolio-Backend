console.log(":: Shree Ganeshay namah ::");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { connectDb } = require("./config/database");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/ErrorHandler");
const categoryRoutes = require("./routes/Category");
const projectsRoutes = require("./routes/projects");
const blogRoutes = require("./routes/blog");

// 2) App Config
const PORT = process.env.PORT || 4000;

// 3) Database Connection
connectDb();

// 4) Middlewares
app.use(express.json());
app.use(cookieParser());

// Allowed origin
const allowedOrigins = [
  "http://localhost:5173",
  "https://riteshmishra.online",
  "https://www.riteshmishra.online",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Agar request ka origin allowed list me hai ya origin undefined hai (postman jaise tools ke liye)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// 5) Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use("/api/v1/blogs", blogRoutes);

app.use(errorHandler);

// 6) Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
