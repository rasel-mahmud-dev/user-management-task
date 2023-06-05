
import express, { Request, Response, NextFunction } from "express"
import sessions from "express-session"
import cookieParser from "cookie-parser"

require("dotenv").config()

import routes from "../routes"

const app = express()

app.use(express.json())


app.use(sessions({
    secret: process.env.SESSION_SECRET as string,
    name: `daffyduck`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // This will only work if you have https enabled!
        maxAge: 10000 // 10 sec
    }
}));


// cookie parser middleware
// app.use(cookieParser());

app.use(routes)


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