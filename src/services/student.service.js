const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const ApiError = require("../utils/ApiError");
const { default: toUTCDate } = require("../utils/toUTC");
const generateToken = require("../utils/generateToken");
const { STUDENT } = require("../constants/roles");

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

module.exports = { createStudent };
