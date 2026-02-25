import generateFormError from "../utils/generateFormError.js";
import buildValidators from "./buildValidators.js";

export const authValidation = () => {
  const rules = [
    { field: "email", type: "email" },
    { field: "password", type: "notEmpty" },
  ];

  const validators = buildValidators(rules);
  return [...validators, generateFormError];
};

export const registerValidation = (isStudent) => {
  const rules = [
    { field: "firstName", type: "notEmpty" },
    { field: "lastName", type: "notEmpty" },
    { field: "email", type: "email" },
    { field: "password", type: "notEmpty" },
    { field: "phone", type: "notEmpty" },
    isStudent && { field: "gender", type: "notEmpty" },
    { field: "dateOfBirth", type: "date" },
  ].filter(Boolean);

  const validators = buildValidators(rules);
  return [...validators, generateFormError];
};
