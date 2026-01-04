import {z} from "zod";
export const zodCreateUserSchema = z.object({
    username:z.string().min(3,{message:"username must be at least 3 characters long"}),
    email:z.string().email({message:"invalid email address"}),
    password:z.string().min(6, {message:"password must be at least 6 characters long"}),
    role:z.enum(['viewer', 'owner']).optional()
})