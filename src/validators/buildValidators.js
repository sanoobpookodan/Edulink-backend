const { body } = require("express-validator");

function buildValidators(rules = []) {
  return rules.map((rule) => {
    let validator = body(rule.field);
    let message;
    switch (rule.type) {
      case "notEmpty":
        message =
          rule.message ||
          `${rule.field ? rule.field.charAt(0).toUpperCase() + rule.field.slice(1) : "Field"} is required`;
        validator = validator.trim().notEmpty().withMessage(message);
        break;

      case "length":
        message =
          rule.message ||
          (rule.min == rule.max
            ? `${rule.field ? rule.field.charAt(0).toUpperCase() + rule.field.slice(1) : "Field"} must be ${rule.min} characters`
            : `${rule.field ? rule.field.charAt(0).toUpperCase() + rule.field.slice(1) : "Field"} must be between ${rule.min} and ${rule.max} characters`);
        validator = validator
          .isLength({ min: rule.min, max: rule.max })
          .withMessage(message);
        break;

      case "phone":
        validator = validator
          .notEmpty()
          .withMessage("Phone number is required")
          .bail()
          .isMobilePhone("en-IN")
          .withMessage("Invalid phone number");
        break;
      case "email":
        validator = validator
          .notEmpty()
          .withMessage("Email is required")
          .bail()
          .isEmail()
          .withMessage("Invalid email");
        break;
      case "date":
        message = rule.message || "Date must be in yyyy-mm-dd format";
        validator = validator
          .notEmpty()
          .withMessage("Date of birth is required")
          .bail()
          .matches(/^\d{4}-\d{2}-\d{2}$/)
          .withMessage(message);
        break;
      default:
        throw new Error(`Unknown validation type: ${rule.type}`);
    }

    return validator;
  });
}

module.exports = buildValidators;
