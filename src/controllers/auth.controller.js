const authService = require("../services/auth.service");
const studService = require("../services/student.service");

const student_register = async (req, res, next) => {
  try {
    const imagePath = req.file?.path || null;
    const data = await studService.createStudent({
      ...req.body,
      image: imagePath,
    });
    res
      .status(201)
      .json({ success: true, data: { user: data.user, token: data.token } });
  } catch (err) {
    next(err);
  }
};

const instructor_register = async (req, res, next) => {
  try {
    const data = await authService.userCreation(req.body);
    res
      .status(201)
      .json({ success: true, data: { user: data.user, token: data.token } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, data: { user: data.user, token: data.token } });
  } catch (err) {
    next(err);
  }
};

module.exports = { student_register, instructor_register, login };
