const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validation = require("../validators/validation");

router.post("/login", validation.authValidation(), authController.login);

router.post(
  "/student-register",
  validation.registerValidation(true),
  authController.register,
);

router.post(
  "/instructor-register",
  validation.registerValidation(),
  authController.register,
);

module.exports = router;
