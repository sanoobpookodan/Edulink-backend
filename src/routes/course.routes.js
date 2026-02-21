const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { INSTRUCTOR, ADMIN } = require("../constants/roles");

router.get("/", protect, authorize(ADMIN), courseController.getCourses);

router.post(
  "/",
  protect,
  authorize(INSTRUCTOR, ADMIN),
  courseController.createCourse,
);

module.exports = router;
