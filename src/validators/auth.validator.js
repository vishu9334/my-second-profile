import { z } from "zod";

export const zodLoginSchema = z
  .object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6, {
      message: "password must be at least 6 characters long",
    }),
  })
  .refine(
    (data) => data.username || data.email,
    {
      message: "either username or email is required",
      path: ["username"],
    }
  );