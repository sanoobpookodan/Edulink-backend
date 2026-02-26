import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

import ApiError from "../utils/ApiError.js";
import toUTCDate from "../utils/toUTC.js";
import { ADMIN, STUDENT } from "../constants/roles.js";
import { buildQueryOptions } from "../utils/queryBuilder.js";
import { deleteLocalFile } from "../utils/file.utils.js";

export const createStudentWithUser = async (data) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) throw new ApiError(400, "Email already registered");

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

export async function updateStudentService(id, data, currentUser, imagePath) {
  let oldImage = null;

  const result = await prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    // Email uniqueness check
    if (data.email && data.email !== student.user.email) {
      const existing = await tx.user.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        throw new ApiError(400, "Email already registered");
      }
    }

    // Prepare user update data
    const userUpdateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    await tx.user.update({
      where: { id: student.userId },
      data: userUpdateData,
    });

    // Save old image before overwriting
    if (imagePath && student.image) {
      oldImage = student.image;
    }

    const updatedStudent = await tx.student.update({
      where: { id },
      data: {
        phone: data.phone,
        image: imagePath || student.image,
        gender: data.gender?.toUpperCase(),
        dateOfBirth: toUTCDate(data.dateOfBirth),
        updatedById: currentUser?.id,
      },
      include: { user: true },
    });
    return updatedStudent;
  });

  // 🔥 Delete old image AFTER transaction success
  if (oldImage) {
    await deleteLocalFile(oldImage);
  }
  return result;
}

export const getAllStudentsService = async ({
  isActive,
  sortBy,
  order,
  page,
  limit,
}) => {
  const { skip, take, orderBy, meta } = buildQueryOptions({
    query: { sortBy, order, page, limit },
    allowedSortFields: ["createdAt", "phone"],
    defaultSortField: "createdAt",
  });

  const where = {};

  if (isActive !== undefined) {
    where.user = {
      isActive: isActive === "true",
    };
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        user: true,
      },
      orderBy,
      skip,
      take,
    }),
    prisma.student.count({ where }),
  ]);

  return {
    data: students,
    meta: {
      ...meta,
      total,
      totalPages: Math.ceil(total / meta.limit),
    },
  };
};

export const getStudentByIdService = async (id) => {
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};
