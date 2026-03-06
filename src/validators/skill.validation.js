import { z } from "zod";
export const skillSchemaZod = z.object({
    skillTeachLogo:z.array(z.string()).optional(),
    professionalSkill:z.array(z.string()).min(1, "At least one professional skill."),
    toolsHeadLine:z.string().optional(),
    applications:z.array(z.string()).optional(),
    applicationLogo:z.array(z.string()).optional()
    
})