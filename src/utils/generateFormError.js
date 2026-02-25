import { validationResult } from "express-validator";

const generateFormError = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    next();
  } catch (error) {
    console.log(error, "===");
  }
};

export default generateFormError;
