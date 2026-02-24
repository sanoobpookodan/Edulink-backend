const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validation = require("../validators/validation");

router.post(
  "/student-register",
  validation.registerValidation(),
  authController.register,
);
router.post(
  "/instructor-register",
  validation.registerValidation(),
  authController.register,
);
router.post("/login", validation.authValidation(), authController.login);

module.exports = router;
