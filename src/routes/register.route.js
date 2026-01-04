import {Router} from "express"
import {registerUser} from "../controllers/user.controller.js"
import { validate } from "../middlewares/validate.js"
import {zodCreateUserSchema} from "../validators/user.validator.js"

const router = Router();

router.post("/register", validate(zodCreateUserSchema), registerUser)

export default router