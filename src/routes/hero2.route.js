import {Router} from "express"
import { validate } from "../middlewares/validate.js"
import {hero2SchemaZod} from "../validators/hero2.validator.js"
import { intro } from "../controllers/hero2.controller.js";
import { accessTokenCheck } from "../middlewares/tokenCheck.middleware.js";


const router = Router();

router.post("/hero2", accessTokenCheck, validate(hero2SchemaZod), intro)

export default router