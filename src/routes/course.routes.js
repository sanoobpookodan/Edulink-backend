import express from "express";
import * as courseController from "../controllers/course.controller.js";
import { requireAuth, authorize } from "../middlewares/auth.middleware.js";
import { INSTRUCTOR, ADMIN } from "../constants/roles.js";

const router = express.Router();

router.get("/", courseController.getCourses);

router.post("/", requireAuth, courseController.createCourse);

export default router;
