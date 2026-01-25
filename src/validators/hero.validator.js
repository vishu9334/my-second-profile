import { z } from "zod";

export const heroSchemaZod = z
  .object({
    initialText: z.string().min(1, "initialText cannot be empty"),
    name: z.string().min(1, "name cannot be empty"),

    role: z.enum([
      "Junior Developer",
      "Senior Developer",
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
    ]),

    backendStack: z
      .array(z.enum(["MongoDB", "Express.js", "Node.js"]))
      .min(1, "backendStack cannot be empty")
      .optional(),

    frontendStack: z
      .array(z.enum(["React.js", "Tailwind CSS", "CSS", "HTML"]))
      .min(1, "frontendStack cannot be empty")
      .optional(),

    toolsStack: z
      .array(z.enum(["GitHub", "Git", "Postman", "Notion"]))
      .min(1, "toolsStack cannot be empty")
      .optional(),
  })
  .refine((data) => data.backendStack, {
    path: ["backendStack"],
    message: "backendStack is required",
  })
  .refine((data) => data.frontendStack, {
    path: ["frontendStack"],
    message: "frontendStack is required",
  })
  .refine((data) => data.toolsStack, {
    path: ["toolsStack"],
    message: "toolsStack is required",
  });