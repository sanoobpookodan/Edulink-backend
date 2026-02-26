import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

import ApiError from "../utils/ApiError.js";
import toUTCDate from "../utils/toUTC.js";
import { ADMIN, STUDENT } from "../constants/roles.js";

export const createStudentWithUser = async (data) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) throw new ApiError(400, "Email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  let { role, id: userId } = data.user || {};
  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: STUDENT,
        isActive: role === ADMIN ? true : false,
      },
    });

    const creatorId = userId || newUser.id;

    const student = await tx.student.create({
      data: {
        userId: newUser.id,
        phone: data.phone,
        image: data.image,
        gender: data.gender.toUpperCase(),
        dateOfBirth: toUTCDate(data.dateOfBirth),
        createdById: creatorId,
        updatedById: creatorId,
      },
    });

    return { ...newUser, student };
  });

  return result;
};

export async function updateStudentService(id, data, currentUser) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Update User (without role)
    const userUpdateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    // Only update password if provided
    if (data.password) {
      userUpdateData.password = await bcrypt.hash(data.password, 10);
    }

    const student = await tx.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    await tx.user.update({
      where: { id: student.userId },
      data: userUpdateData,
    });

    // 2️⃣ Update Student profile
    const updatedStudent = await tx.student.update({
      where: { id },
      data: {
        phone: data.phone,
        image: data.image,
        gender: data.gender?.toUpperCase(),
        dateOfBirth: data.dateOfBirth,
        updatedById: currentUser?.id,
      },
      include: {
        user: true,
      },
    });

    return updatedStudent;
  });
}

export const getAllStudentsService = async () => {
  return await prisma.student.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
