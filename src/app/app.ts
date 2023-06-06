import express, { Request, Response, NextFunction } from "express"
import sessions from "express-session"
import cors, {CorsOptions} from "cors"
import cookieParser from "cookie-parser";
const csurf = require("tiny-csrf");

require("dotenv").config({
    path: '.env.dev'
})

import routes from "../routes"
import {RequestWithCSRF} from "../types";


const app = express()

app.use(express.json())



const allowedOrigin = [process.env.FRONTEND as string, "http://localhost"]

// CORS options
const corsOptions: CorsOptions = {
    origin: allowedOrigin,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
// CORS middleware
app.use(cors(corsOptions));


// cookie parser middleware
app.use(cookieParser(process.env.SESSION_SECRET as string))


app.use(sessions({
    secret: process.env.SESSION_SECRET as string,
    name: `prisma-task`, // cookie name
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // This will only work if you have https enabled!
        maxAge: (1000 * 3600) * 24 // 1days
    }
}));


//NOTE: You can disable CSRF protection for REST API to get better performance

// Set up CSRF protection middleware
const CSRFTOKEN_SECRET = "123456789iamasecret987654321look" // should be 32 character
const csrfProtection = csurf(CSRFTOKEN_SECRET,  ["POST"], ["/\\/api/\\.*/i"] );
app.use(csrfProtection);


// get csurf token
app.get("/", (req: RequestWithCSRF, res: Response, next: NextFunction)=>{
    const csrfToken = req?.csrfToken && req.csrfToken() as string || ""
    return res.status(200).json({
        message: "Your csurf token",
        token: csrfToken
    })
})

// all route are initiated
app.use(routes)


// global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let message = "Internal error"
    if (typeof err === "string") {
        message = err
    } else if (err?.message && typeof err?.message === "string") {
        message = err?.message
    }
    if (err) {
        res.status(500).json({ message })
    }
})


export default app