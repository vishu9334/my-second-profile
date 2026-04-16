import { z } from "zod";
import mongoose from "mongoose";

const formArrayPreprocessor = (val) => {
  if (val === undefined || val === null) return undefined;

  // If already array (multiple form-data fields), return as is
  if (Array.isArray(val)) return val;

  if (typeof val === "string") {
    // Try JSON parse first (in case frontend sends stringified array)
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}

    // If comma-separated string, split properly
    if (val.includes(",")) {
      return val
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // Single string value
    return [val.trim()];
  }

  return undefined;
};

const jsonObjectPreprocessor = (val) => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "object" && !Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return undefined;
    }
  }
  return undefined;
};

const aboutSectionZod = z.object({
  // img: z.array(z.string().min(1, "Image URL cannot be empty"))
  //       .min(1, "At least one image required"),
  img: z.preprocess(
    formArrayPreprocessor,
    z.array(z.string().min(1, "Image path cannot be empty")).min(1, "At least one image required")
  ).nullable().optional(),

  aboutTitle: z.preprocess(
    formArrayPreprocessor,
    z.array(z.string().min(1, "Title cannot be empty")).min(1, "At least one title required")
  ).nullable().optional(),

  paragraph: z.preprocess(
    formArrayPreprocessor,
    z.array(z.string().min(1, "Paragraph cannot be empty")).min(1, "At least one paragraph required")
  ).nullable().optional(),

  paragraphTwo: z.string()
                 .min(1, "ParagraphTwo cannot be empty").nullable().optional(),

  hobbies: z.preprocess(
    formArrayPreprocessor,
    z.array(z.string().min(1, "Hobby cannot be empty")).min(1, "At least one hobby required")
  ).nullable().optional(),

  quote: z.string()
          .min(1, "Quote cannot be empty")
          .transform(val => val.toUpperCase()).nullable().optional(),

  createdBy: z.string()
              .refine(val => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid User ID",
              }).optional(),

  add: z.preprocess(
    jsonObjectPreprocessor,
    z.record(z.string(), z.array(z.string())).optional(),
  ),

  remove: z.preprocess(
    jsonObjectPreprocessor,
    z.record(z.string(), z.array(z.string())).optional(),
  ),

  replaceArrays: z.preprocess(
    (v) => v === true || v === "true",
    z.boolean().optional(),
  ),
});

export { aboutSectionZod };