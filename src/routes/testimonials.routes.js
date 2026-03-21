import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { ADMIN, STUDENT } from "../constants/roles.js";
import {
  getAllTestimonials,
  createTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller.js";
import {
  createTestimonialValidation,
  updateTestimonialValidation,
  testimonialIdValidation,
} from "../validators/testimonial.validator.js";

const router = express.Router();

router.get("/", getAllTestimonials);

router.post(
  "/",
  authenticate,
  authorize(STUDENT),
  createTestimonialValidation(),
  createTestimonial,
);

router.get("/:id", testimonialIdValidation(), getTestimonialById);

router.patch(
  "/:id",
  authenticate,
  authorize(STUDENT, ADMIN),
  testimonialIdValidation(),
  updateTestimonialValidation(),
  updateTestimonial,
);

router.delete(
  "/:id",
  authenticate,
  authorize(ADMIN),
  testimonialIdValidation(),
  deleteTestimonial,
);

export default router;
