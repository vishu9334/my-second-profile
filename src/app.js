import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const portfolioPublic = path.join(__dirname, '..', '..', 'public');
import  register  from './routes/register.route.js';
import login from "./routes/login.route.js"
import {globalErrorMiddleware} from "./middlewares/global.middleware.js"
import loggedOut from "./routes/loggedOut.route.js"
import hero from "./routes/hero.route.js"
import hero2 from "./routes/hero2.route.js"
import about from "./routes/about.route.js"
import home from "./routes/home.route.js"
import skill from "./routes/skill.route.js"
import resume from "./routes/resume.route.js"
const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"))
app.use(express.static(portfolioPublic))
app.use(cookieParser())

app.use("/v1/user", register)
app.use("/v1/user", login)
app.use("/v1/user",loggedOut)
app.use("/v1/user",hero)
app.use("/v1/user",hero2)
app.use("/v1/user",about)
app.use("/v1/user",home)
app.use("/v1/user",skill)
app.use("/v1/user", resume)

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(globalErrorMiddleware)

export default app