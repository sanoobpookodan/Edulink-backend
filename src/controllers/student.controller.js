import prisma from "../config/prisma.js";
import { userSerializer } from "../serializers/auth.serializer.js";
import { studentSerializer } from "../serializers/student.serializer.js";
import {
  updateStudentService,
  createStudentWithUser,
  getAllStudentsService,
  getStudentByIdService,
  deleteStudentService,
} from "../services/student.service.js";
import ApiError from "../utils/ApiError.js";

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await getAllStudentsService(req.query);
    students.data = students.data.map(studentSerializer);
    res.json({
      success: true,
      ...students,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await getStudentByIdService(req.params.id, req.user);
    const formatted = studentSerializer(student);
    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const imagePath = req.fileUrl || undefined;
    const user = req.user;
    const data = await createStudentWithUser({
      ...req.body,
      image: imagePath,
      user: user,
    });
    const formatted = userSerializer(data);
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const updatedStudent = await updateStudentService(
      req?.params?.id,
      req.body,
      req.user,
      req.fileUrl,
    );

    const formatted = studentSerializer(updatedStudent);

    res.json({
      success: true,
      message: "Student updated successfully",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await deleteStudentService(req.params.id, req.user);
    res.json({
      success: true,
      message: "Student deleted successfully",
      data: studentSerializer(student),
    });
  } catch (err) {
    next(err);
  }
};
