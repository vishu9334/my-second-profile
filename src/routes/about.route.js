import {Router} from "express"
import { validate } from "../middlewares/validate.js"
import {aboutSectionZod} from "../validators/about.validation.js"
import { aboutSection } from "../controllers/about.controller.js";
import { accessTokenCheck } from "../middlewares/tokenCheck.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


router.route("/about").patch(
   accessTokenCheck,
   upload.fields([{ name: 'img', maxCount: 3 }]),
   validate(aboutSectionZod),
   aboutSection
)


export default router