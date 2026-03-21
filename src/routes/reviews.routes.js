import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { ADMIN, STUDENT } from "../constants/roles.js";
import {
  createReview,
  getCourseReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post(
  "/courses/:courseId/reviews",
  authenticate,
  authorize(STUDENT),
  createReview,
);

router.get("/courses/:courseId/reviews", getCourseReviews);

router.delete("/:id", authenticate, authorize(ADMIN, STUDENT), deleteReview);

export default router;
