import express from "express";
import createUploader from "../middlewares/upload.js";
// validations
import {
  authValidation,
  registerValidation,
} from "../validators/validation.js";

// controllers
import {
  login,
  registerStudent,
  registerInstructor,
} from "../controllers/auth.controller.js";
const router = express.Router();

const uploadUser = createUploader("users");

router.post("/login", authValidation(), login);

router.post(
  "/student-register",
  uploadUser.single("image"),
  registerValidation(true),
  registerStudent,
);

router.post(
  "/instructor-register",
  registerValidation(false),
  registerInstructor,
);

export default router;
