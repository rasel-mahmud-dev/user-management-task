import { Router, Request, Response, NextFunction } from "express"
import * as yup from "yup"


import { hashPassword, comparePass } from "../services/hash"
import prisma from './../db/client';
import { CustomSession } from "../types";



const router = Router()

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        const schema = yup.object({
            email: yup.string().email().required().max(250).label("Email"),
            password: yup.string().required().max(500).label("Password")
        })

        await schema.validate({ email, password })

        let user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) return next("User not registered yet. Please register first")


        let isMatch = await comparePass(user.password, password)
        if (!isMatch) return next("Password not match")


        let session = req.session as CustomSession
        session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        res.status(201).json({ ...user, password: "" })

    } catch (ex) {
        next(ex)
    }
})


router.post("/registration", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body

        const schema = yup.object({
            name: yup.string().required().max(80).label("Name"),
            email: yup.string().email().required().max(250).label("Email"),
            password: yup.string().required().max(500).label("Password")
        })

        await schema.validate({ name, email, password })

        let user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (user) return next("User already registered. Please login")


        const hash = await hashPassword(password)

        let newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hash
            }
        })
        let session = req.session as CustomSession
        session.user = {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        }
        res.status(201).json(newUser)

    } catch (ex) {
        next(ex)
    }
})


router.get("/logout", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let session = req.session as CustomSession
        session.destroy((err) => {
            if (err) {
                return next("User logout fail")
            }
            res.status(201).json({ message: "User logouted" })
        })

    } catch (ex) {
        next(ex)
    }
})




export default router