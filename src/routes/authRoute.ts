import { Router, Request, Response, NextFunction } from "express"
import * as yup from "yup"


import { hashPassword } from "../services/hash"
import prisma from './../db/client';
import { Role } from "../types";



const router = Router()

router.post("/login", (req, res, next) => {
    res.send("hi")
})



router.post("/registration", async (req: Request, res: Response, next: NextFunction) => {

    type S = typeof req.session
    type CustomSession = S & {
        user: {
            id: number,
            email: string
            role: Role
        }
    }

    let session: CustomSession = req.session as CustomSession

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
        session.user = {
            id: newUser.id,
            email: newUser.email,
            role: Role.User
        }
        res.status(201).json(newUser)

    } catch (ex) {
        next(ex)
    }

})





export default router