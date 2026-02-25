import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";

const requireAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return next(new ApiError(401, "User not found"));

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid token"));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }
    next();
  };
};

export { requireAuth, authorize };
