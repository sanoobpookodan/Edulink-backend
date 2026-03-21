import {
  createCourseService,
  getAllCoursesService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
  getCourseCurriculumService,
  createCurriculumService,
  updateCurriculumService,
  deleteCurriculumService,
} from "../services/course.service.js";
import ApiError from "../utils/ApiError.js";
import { courseSerializer } from "../serializers/course.serializer.js";
import { curriculumSerializer } from "../serializers/curriculum.serializer.js";

export const getAllCourses = async (req, res, next) => {
  try {
    const result = await getAllCoursesService(req.query);
    result.data = result.data.map(courseSerializer);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const imagePath = req.fileUrl || undefined;
    const course = await createCourseService(req.body, req.user.id, imagePath);
    const serialized = courseSerializer(course);

    res.status(201).json({ success: true, data: serialized });
  } catch (err) {
    next(err);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await getAllCoursesService(req.query);
    courses.data = courses.data.map(courseSerializer);

    res.json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await getCourseByIdService(id);
    const serialized = courseSerializer(course);
    res.json({ success: true, data: serialized });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imagePath = req.fileUrl || undefined;
    const course = await updateCourseService(
      id,
      req.body,
      req.user.id,
      imagePath,
    );
    const serialized = courseSerializer(course);
    res.json({ success: true, message: "Course updated", data: serialized });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCourseService(id, req.user.id);
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};

// Curriculum
export const getCourseCurriculum = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const curriculum = await getCourseCurriculumService(courseId);
    const serialized = curriculum.map(curriculumSerializer);
    res.json({ success: true, data: serialized });
  } catch (err) {
    next(err);
  }
};

export const createCurriculum = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const curriculum = await createCurriculumService(courseId, req.body);
    const serialized = curriculumSerializer(curriculum);
    res
      .status(201)
      .json({ success: true, message: "Curriculum created", data: serialized });
  } catch (err) {
    next(err);
  }
};

export const updateCurriculum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const curriculum = await updateCurriculumService(id, req.body);
    const serialized = curriculumSerializer(curriculum);
    res.json({
      success: true,
      message: "Curriculum updated",
      data: serialized,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCurriculum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCurriculumService(id);
    res.json({ success: true, message: "Curriculum deleted" });
  } catch (err) {
    next(err);
  }
};

export { createCourse, getCourses };
