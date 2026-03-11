// routes/home.routes.js

import express from "express";
import { getHome } from "../controllers/getHome.controller.js";

const router = express.Router();

router.get("/home", getHome);

export default router;