const buildValidators = require("./buildValidators");

const authValidation = () => {
  const rules = [
    { field: "email", type: "email" },
    {
      field: "password",
      type: "notEmpty",
    },
  ];
  return buildValidators(rules);
};

const registerValidation = () => {
  const rules = [
    { field: "firstName", type: "notEmpty" },
    { field: "lastName", type: "notEmpty" },
    { field: "email", type: "email" },
    { field: "password", type: "notEmpty" },
    { field: "phone", type: "notEmpty" },
    { field: "gender", type: "notEmpty" },
    { field: "dateOfBirth", type: "date" },
  ];
  return buildValidators(rules);
};

module.exports = {
  authValidation,
  registerValidation,
};
