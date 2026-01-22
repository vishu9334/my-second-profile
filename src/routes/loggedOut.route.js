import express from "express"
import { logout } from "../controllers/user.controller.js"
import {accessTokenCheck} from '../middlewares/tokenCheck.middleware.js'
const router = express.Router()
router.post("/logout",accessTokenCheck, logout)

export default router
