const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const { requireAuth, authorize } = require("../middlewares/auth.middleware");
const { INSTRUCTOR, ADMIN } = require("../constants/roles");

router.get("/", courseController.getCourses);

router.post("/", requireAuth, courseController.createCourse);

module.exports = router;
