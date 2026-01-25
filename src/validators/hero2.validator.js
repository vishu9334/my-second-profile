
import { z } from "zod";

export const hero2SchemaZod = z.object({
  heading: z
    .string({ required_error: "heading is required" })
    .trim()
    .min(1, "heading cannot be empty"),

  content: z
    .string({ required_error: "content is required" })
    .min(1, "content cannot be empty"),

  highlights: z
    .array(z.string().min(1, "highlight cannot be empty"))
    .optional()
    .default([]),
});