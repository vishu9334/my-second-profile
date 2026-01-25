import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    const errors = Object.entries(fieldErrors).map(
      ([field, messages]) => `${field}: ${messages[0]}`
    );

    return res.status(400).json({
      success: false,
      errors,
    });
  }

  req.body = result.data;
  next();
};