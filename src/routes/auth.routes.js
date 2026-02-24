const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validation = require("../validators/validation");
const createUploader = require("../middlewares/upload");
const uploadUser = createUploader("users");

router.post("/login", validation.authValidation(), authController.login);

router.post(
  "/student-register",
  uploadUser.single("image"),
  validation.registerValidation(true),
  authController.student_register,
);

router.post(
  "/instructor-register",
  validation.registerValidation(),
  authController.instructor_register,
);

module.exports = router;
