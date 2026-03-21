import express from "express";
import createUploader from "../middlewares/upload.middleware.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { ADMIN, INSTRUCTOR } from "../constants/roles.js";
import {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseCurriculum,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
} from "../controllers/course.controller.js";
import {
  createCourseValidation,
  updateCourseValidation,
  courseIdValidation,
} from "../validators/course.validator.js";
import {
  createCurriculumValidation,
  updateCurriculumValidation,
  courseIdParamValidation,
  curriculumIdValidation,
} from "../validators/curriculum.validator.js";

const router = express.Router();
const uploadCourse = createUploader("courses");

// Courses
router.get("/", getAllCourses);

router.post(
  "/",
  authenticate,
  authorize(ADMIN),
  // uploadCourse.single("image"),
  createCourseValidation(),
  createCourse,
);

router.get("/:id", courseIdValidation(), getCourseById);

router.patch(
  "/:id",
  authenticate,
  authorize(ADMIN),
  uploadCourse.single("image"),
  updateCourseValidation(),
  updateCourse,
);

router.delete(
  "/:id",
  authenticate,
  authorize(ADMIN),
  courseIdValidation(),
  deleteCourse,
);

// Curriculum
router.get(
  "/:courseId/curriculum",
  courseIdParamValidation(),
  getCourseCurriculum,
);

router.post(
  "/:courseId/curriculum",
  authenticate,
  authorize(ADMIN),
  courseIdParamValidation(),
  createCurriculumValidation(),
  createCurriculum,
);

router.patch(
  "/curriculum/:id",
  authenticate,
  authorize(ADMIN),
  curriculumIdValidation(),
  updateCurriculumValidation(),
  updateCurriculum,
);

router.delete(
  "/curriculum/:id",
  authenticate,
  authorize(ADMIN),
  curriculumIdValidation(),
  deleteCurriculum,
);

export default router;
