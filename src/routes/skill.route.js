import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { skillSection } from "../controllers/skill.controller.js";
import { accessTokenCheck } from "../middlewares/tokenCheck.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import {skillSchemaZod} from "../validators/skill.validation.js"
import coerceStacks from "../middlewares/coerceArray.middleware.js";


const router = Router();

router.route("/skill").patch(accessTokenCheck, upload.fields([
   { name: "skillTeachLogo", maxCount: 30 },
   { name: "applicationLogo", maxCount: 5 }
 ]),coerceStacks, validate(skillSchemaZod), skillSection )

export default router