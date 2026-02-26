import express from "express";
import createUploader from "../middlewares/upload.middleware.js";
import {
  createStudentValidation,
  updateStudentValidation,
} from "../validators/student.validator.js";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { ADMIN, STUDENT } from "../constants/roles.js";

const router = express.Router();

const uploadUser = createUploader("users");

router.get("/", authenticate, authorize(ADMIN), getAllStudents);

router.get("/:id", authenticate, authorize(ADMIN, STUDENT), getStudentById);

router.post(
  "/",
  uploadUser.single("image"),
  createStudentValidation(),
  createStudent,
);

router.patch(
  "/:id",
  authenticate,
  authorize(ADMIN, STUDENT),
  updateStudentValidation(),
  uploadUser.single("image"),
  updateStudent,
);

router.delete("/:id", authenticate, authorize(ADMIN), deleteStudent);

export default router;
