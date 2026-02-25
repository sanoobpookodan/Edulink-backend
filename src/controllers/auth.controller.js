import { loginUser } from "../services/auth.service.js";
import { createStudent } from "../services/student.service.js";

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body.email, req.body.password);
    res.json({
      success: true,
      data: { user: data.user, token: data.token },
    });
  } catch (err) {
    next(err);
  }
};

export const registerStudent = async (req, res, next) => {
  try {
    const imagePath = req.file?.path || null;

    const data = await createStudent({
      ...req.body,
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      data: { user: data.user, token: data.token },
    });
  } catch (err) {
    next(err);
  }
};

export const registerInstructor = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
