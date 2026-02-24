const generateFormError = require("../utils/generateFormError");
const buildValidators = require("./buildValidators");

const authValidation = () => {
  const rules = [
    { field: "email", type: "email" },
    {
      field: "password",
      type: "notEmpty",
    },
  ];
  const validators = buildValidators(rules);
  return [...validators, generateFormError];
};

const registerValidation = (isStudent) => {
  const rules = [
    { field: "firstName", type: "notEmpty" },
    { field: "lastName", type: "notEmpty" },
    { field: "email", type: "email" },
    { field: "password", type: "notEmpty" },
    { field: "phone", type: "notEmpty" },
    isStudent && { field: "gender", type: "notEmpty" },
    { field: "dateOfBirth", type: "date" },
  ].filter(Boolean); // Remove falsey values
  const validators = buildValidators(rules);
  return [...validators, generateFormError];
};

module.exports = {
  authValidation,
  registerValidation,
};
