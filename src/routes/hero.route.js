import {Router} from "express"
import { validate } from "../middlewares/validate.js"
import {heroSchemaZod} from "../validators/hero.validator.js"
import { heroSection } from "../controllers/hero.controller.js";
import { accessTokenCheck } from "../middlewares/tokenCheck.middleware.js";


const router = Router();

router.post("/hero", accessTokenCheck, validate(heroSchemaZod), heroSection)

export default router