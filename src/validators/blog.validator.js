import { body, param } from "express-validator";
import generateFormError from "../middlewares/validate.middleware.js";
import buildValidators from "../utils/buildValidators.js";

export const createBlogValidation = () => {
  const rules = [
    { field: "title", type: "notEmpty" },
    { field: "description", type: "notEmpty" },
    { field: "content", type: "notEmpty" },
    { field: "categoryId", type: "notEmpty" },
  ];

  return [
    ...buildValidators(rules),
    body("status")
      .optional()
      .isIn([
        "DRAFT",
        "PUBLISHED",
        "ARCHIVED",
        "draft",
        "published",
        "archived",
      ])
      .withMessage("Status must be DRAFT, PUBLISHED or ARCHIVED"),
    generateFormError,
  ];
};

export const updateBlogValidation = () => {
  const rules = [
    { field: "title", type: "notEmpty" },
    { field: "description", type: "notEmpty" },
  ];

  return [
    ...buildValidators(rules),
    body("status")
      .optional()
      .isIn([
        "DRAFT",
        "PUBLISHED",
        "ARCHIVED",
        "draft",
        "published",
        "archived",
      ])
      .withMessage("Status must be DRAFT, PUBLISHED or ARCHIVED"),
    generateFormError,
  ];
};

export const blogIdValidation = () => {
  return [
    param("id").isUUID().withMessage("Invalid blog id"),
    generateFormError,
  ];
};
