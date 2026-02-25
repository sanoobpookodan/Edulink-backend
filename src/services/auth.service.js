import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import { STUDENT } from "../constants/roles.js";

const createUser = async (data) => {
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
    },
  });

  const token = generateToken(user);

  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new ApiError(400, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new ApiError(400, "Invalid Password");

  const token = generateToken(user);

  return { user, token };
};

export { createUser, loginUser };
