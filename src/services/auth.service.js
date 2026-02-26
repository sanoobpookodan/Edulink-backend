import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import { ADMIN, STUDENT } from "../constants/roles.js";
import toUTCDate from "../utils/toUTC.js";
import { createStudentWithUser } from "./student.service.js";

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new ApiError(400, "User not found");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(400, "Invalid Password");
  const token = generateToken(user);
  return { user, token };
};

export const createStudent = async (data) => {
  return createStudentWithUser(data);
};
