import { loginUser, createStudent } from "../services/auth.service.js";

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

export const signUpStudent = async (req, res, next) => {
  try {
    const imagePath = req.fileUrl || undefined;
    const user = req.user;
    const data = await createStudent({
      ...req.body,
      image: imagePath,
      user: user,
    });
    res.status(201).json({
      success: true,
      data,
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
