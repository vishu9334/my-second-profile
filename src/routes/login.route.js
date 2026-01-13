import express from "express"
import { login } from "../controllers/user.controller.js"
import { zodLoginSchema } from "../validators/auth.validator.js"
import { validate } from "../middlewares/validate.js"

const router = express.Router()
router.post("/login", validate(zodLoginSchema), login)

export default router
