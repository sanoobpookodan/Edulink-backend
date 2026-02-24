const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");
const generateFormError = require("../utils/generateFormError");
const toUTCDate = require("../utils/toUTC");

const register = async (req, res, next) => {
  generateFormError(req, res);

  console.log(req.body.dateOfBirth);
  console.log(toUTCDate(req.body.dateOfBirth));

  try {
    const data = await authService.register(req.body);
    res.status(201).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  generateFormError(req, res);
  try {
    const data = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
