const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Middleware setup
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Error handling middleware (should be last)
app.use(errorMiddleware);

module.exports = app;
