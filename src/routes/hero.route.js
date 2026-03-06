import {Router} from "express"
import { validate } from "../middlewares/validate.js"
import {heroSchemaZod} from "../validators/hero.validator.js"
import { heroSection } from "../controllers/hero.controller.js";
import { accessTokenCheck } from "../middlewares/tokenCheck.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import coerceStacks from "../middlewares/coerceArray.middleware.js";


const router = Router();


router.route("/hero").post(
   accessTokenCheck,
   upload.single("heroAvatar"),
   coerceStacks,
   validate(heroSchemaZod),
   heroSection
)


export default router