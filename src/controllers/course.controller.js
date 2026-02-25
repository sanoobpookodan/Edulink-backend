import * as courseService from "../services/course.service.js";

const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body, req.user.id);

    res.status(201).json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();

    res.json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};

export { createCourse, getCourses };
