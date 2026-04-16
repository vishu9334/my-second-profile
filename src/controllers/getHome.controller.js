import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { About } from "../models/about.schema.js";
import { Hero } from "../models/hero.model.js";
import { Hero2 } from "../models/hero2.model.js";
import { SkillTeach } from "../models/skillSet.schema.js";
import { User } from "../models/user.model.js";

export const getHome = asyncHandler(async (req, res) => {
  const owner = await User.findOne({ role: "owner" })
    .select("username role")
    .lean();

  if (!owner) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { hero: null, hero2: null, about: null, skills: [], owner: null },
        "Home data fetched",
      ),
    );
  }

  const ownerId = owner._id;

  const [hero, hero2, about, skills] = await Promise.all([
    Hero.findOne({ createdBy: ownerId }).lean(),
    Hero2.findOne({ createdBy: ownerId }).lean(),
    About.findOne({ createdBy: ownerId }).lean(),
    SkillTeach.find({ createdBy: ownerId }).lean(),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      { hero, hero2, about, skills, owner },
      "Home data fetched",
    ),
  );
});
