import {NextFunction, Request, Response} from "express"
import prisma from './../db/client';
import * as yup from "yup";


export async function readAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        // create many permissions
        let users = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                password: false,
                role: true,
                createdAt: true,
                isVerified: true,
                resetPin: false,
                resetPinExpiresAt: false
            }
        })

        res.status(201).json({users})

    } catch (ex) {
        next(ex)
    }
}


export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {

        const {name, email, password} = req.body

        const schema = yup.object({
            name: yup.string().required().max(80).label("Name"),
            email: yup.string().email().required().max(250).label("Email"),
            password: yup.string().required().max(500).label("Password")
        })


        await schema.validate({name, email, password})

        let result = await prisma.user.create({
            data: {
                name,
                email,
                password,
                isVerified: false,
                resetPin: "000000",
                resetPinExpiresAt: new Date()
            }
        })

        if (result) {
            res.status(201).json({message: "User has been created"})
        }

    } catch (ex: any) {
        let message = ""
        if (ex.code === 'P2002' && ex.meta.target === "User_email_key") {
            message = "User already exist"
        }
        next(message ? message : ex)
    }
}
