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
  activateStudent,
  resetStudentPassword,
  enrollStudent,
} from "../controllers/student.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { ADMIN, STUDENT } from "../constants/roles.js";

const router = express.Router();

const uploadUser = createUploader("users");
// get students
router.get("/", authenticate, authorize(ADMIN), getAllStudents);
// get student by id
router.get("/:id", authenticate, authorize(ADMIN, STUDENT), getStudentById);
// create student
router.post(
  "/",
  uploadUser.single("image"),
  createStudentValidation(),
  createStudent,
);
// update student
router.patch(
  "/:id",
  authenticate,
  authorize(ADMIN, STUDENT),
  uploadUser.single("image"),
  updateStudentValidation(),
  updateStudent,
);
// delete student
router.delete("/:id", authenticate, authorize(ADMIN), deleteStudent);
// activate student
router.post("/:id/activate", authenticate, authorize(ADMIN), activateStudent);
// reset student password
router.post(
  "/:id/reset-password",
  authenticate,
  authorize(ADMIN),
  resetStudentPassword,
);

// Enroll student in a course
router.post("/:id/enroll", authenticate, authorize(ADMIN), enrollStudent);

export default router;
