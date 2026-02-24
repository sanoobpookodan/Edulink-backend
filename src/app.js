const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const multer = require("multer");
const upload = multer();

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const ApiError = require("./utils/ApiError");

const app = express();

// Middleware setup
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(upload.none());
app.use("/uploads", express.static("uploads"));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// 404 routes
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Error handling middleware (should be last)
app.use(errorMiddleware);

module.exports = app;
