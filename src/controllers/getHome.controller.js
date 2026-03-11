import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { About } from "../models/about.schema.js";
import { Hero } from "../models/hero.model.js";
import { Hero2 } from "../models/hero2.model.js";
import { SkillTeach } from "../models/skillSet.schema.js";
import { User } from "../models/user.model.js";

export const getHome = asyncHandler(async (req, res) => {

  const [hero, hero2, about, skills, users] = await Promise.all([
    Hero.findOne(),
    Hero2.findOne(),
    About.findOne(),
    SkillTeach.find(),
    User.find()
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      { hero, hero2, about, skills, users },
      "Home data fetched"
    )
  );

});