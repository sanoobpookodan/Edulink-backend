const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");
const generateFormError = require("../utils/generateFormError");

const register = async (req, res, next) => {
  try {
    const data = await authService.REGISTER(req.body);
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

module.exports = { register, login };
