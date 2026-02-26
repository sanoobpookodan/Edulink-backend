import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

import ApiError from "../utils/ApiError.js";
import toUTCDate from "../utils/toUTC.js";
import { ADMIN, INSTRUCTOR, STUDENT } from "../constants/roles.js";

export const createInstructorWithUser = async (data) => {
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
        role: INSTRUCTOR,
        isActive: role === ADMIN ? true : false,
      },
    });

    const creatorId = userId || newUser.id;

    const instructor = await tx.instructor.create({
      data: {
        userId: newUser.id,
        phone: data.phone,
        image: data.image,
        bio: data.bio,
        gender: data.gender.toUpperCase(),
        dateOfBirth: toUTCDate(data.dateOfBirth),
        createdById: creatorId,
        updatedById: creatorId,
      },
    });

    return { ...newUser, instructor };
  });

  return result;
};

export async function updateInstructor(id, data, currentUser) {
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

    const instructor = await tx.instructor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!instructor) {
      throw new Error("Instructor not found");
    }

    await tx.user.update({
      where: { id: instructor.userId },
      data: userUpdateData,
    });

    // 2️⃣ Update Instructor profile
    const updatedInstructor = await tx.instructor.update({
      where: { id },
      data: {
        phone: data.phone,
        image: data.image,
        bio: data.bio,
        gender: data.gender?.toUpperCase(),
        dateOfBirth: data.dateOfBirth,
        updatedById: currentUser?.id,
      },
      include: {
        user: true,
      },
    });

    return updatedInstructor;
  });
}
