import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import multer from "multer";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import ApiError from "./utils/ApiError.js";

const app = express();
const multipartParser = multer();
dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL, "===");
// Middleware setup
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(multipartParser.none());
app.use(cookieParser());
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found 404"));
});

// Error middleware (must be last)
app.use(errorMiddleware);

export default app;
