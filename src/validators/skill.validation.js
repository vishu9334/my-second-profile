import { z } from "zod";

const jsonOrArray = (field) =>
  z.preprocess((val) => {
    if (val === undefined || val === null) return undefined;
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return val.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return val;
  }, z.array(z.string()).optional());

export const skillSchemaZod = z.object({
  skillTeachLogo: jsonOrArray("skillTeachLogo"),
  skillTeachLogoJson: jsonOrArray("skillTeachLogoJson"),
  professionalSkill: jsonOrArray("professionalSkill"),
  toolsHeadLine: z.string().optional(),
  applications: jsonOrArray("applications"),
  applicationLogo: jsonOrArray("applicationLogo"),
  applicationLogoJson: jsonOrArray("applicationLogoJson"),
});
