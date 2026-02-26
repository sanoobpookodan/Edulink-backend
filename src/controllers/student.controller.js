import prisma from "../config/prisma.js";
import { studentSerializer } from "../serializers/student.serializer.js";
import {
  updateStudentService,
  createStudentWithUser,
  getAllStudentsService,
} from "../services/student.service.js";
import ApiError from "../utils/ApiError.js";

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await getAllStudentsService();
    const formatted = students.map(studentSerializer);

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    res.json({ success: true, data: student });
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
    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await updateStudentService(id, req.body, req.user);

    res.json({ success: true, student: updatedStudent });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    await prisma.student.delete({ where: { id } });
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};
