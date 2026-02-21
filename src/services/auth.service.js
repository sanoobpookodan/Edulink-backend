const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const { STUDENT } = require("../constants/roles");

const register = async (data) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) throw new ApiError(400, "Email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: STUDENT,
    },
  });

  const token = generateToken(user);

  return { user, token };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new ApiError(400, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new ApiError(400, "Invalid Password");

  const token = generateToken(user);

  return { user, token };
};

module.exports = { register, login };
