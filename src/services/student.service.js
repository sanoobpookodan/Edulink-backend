import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

import ApiError from "../utils/ApiError.js";
import toUTCDate from "../utils/toUTC.js";
import generateToken from "../utils/generateToken.js";
import { STUDENT } from "../constants/roles.js";

const createStudent = async (data) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) throw new ApiError(400, "Email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: STUDENT,
      student: {
        create: {
          phone: data.phone,
          gender: data.gender.toUpperCase(),
          dateOfBirth: toUTCDate(data.dateOfBirth),
          image: data.image || null,
        },
      },
    },
    include: {
      student: true,
    },
  });

  const token = generateToken(user);

  return { user, token };
};

export { createStudent };
