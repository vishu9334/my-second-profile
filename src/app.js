import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import  register  from './routes/register.route.js';
import login from "./routes/login.route.js"
import {globalErrorMiddleware} from "./middlewares/global.middleware.js"
import loggedOut from "./routes/loggedOut.route.js"
import hero from "./routes/hero.route.js"
import hero2 from "./routes/hero2.route.js"

const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/v1/user", register)
app.use("/v1/user", login)
app.use("/v1/user",loggedOut)
app.use("/v1/user",hero)
app.use("/v1/user",hero2)

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(globalErrorMiddleware)

export default app