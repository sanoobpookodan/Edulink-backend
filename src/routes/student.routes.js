import express from "express";
import createUploader from "../middlewares/upload.middleware.js";
// validations
import {
  authValidation,
  registerValidation,
  updateValidation,
} from "../validators/validation.js";
// controllers
import {
  login,
  registerStudent,
  registerInstructor,
} from "../controllers/auth.controller.js";
// middlewares
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
// roles
import { ADMIN, STUDENT } from "../constants/roles.js";

const router = express.Router();

const uploadUser = createUploader("users");

router.post(
  "/update-student",
  authenticate,
  authorize(ADMIN, STUDENT),
  uploadUser.single("image"),
  updateValidation(true),
  updateStudent,
);

router.post(
  "/instructor-register",
  uploadUser.single("image"),
  registerValidation(false),
  registerInstructor,
);

export default router;
