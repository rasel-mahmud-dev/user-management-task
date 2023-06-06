import {NextFunction, Request, Response} from "express"
import prisma from './../db/client';
import * as yup from "yup";
import {Role} from "../types";


export async function readAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        // create many permissions
        let users = await prisma.user.findMany({
            select: {
                id: true,
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



export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {

        const { name } = req.body
        const { userId } = req.params

        const schema = yup.object({
            name: yup.string().required().max(80).label("Name"),
            userId: yup.number().required("Please provide user id").max(80).label("UserId"),
        })

        let id = Number(userId)
        await schema.validate({name, userId: id})

        let result = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                name
            },
            select: {
                id: true,
                email: true,
                role: true,
                password: false,
                isVerified: true,
                resetPin: false,
                resetPinExpiresAt: false
            }
        })

        if (result) {
            res.status(201).json({user: result, message: "User has been updated"})
        }

    } catch (ex: any) {
        next( ex)
    }
}


export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {

        let { userId} = req.params

        const schema = yup.number().required().label("UserId")

        let id = Number(userId)

        await schema.validate( id)

        let result = await prisma.user.deleteMany({
            where: {
                id,
                role: {
                    not: Role.ADMIN
                },
            },
        })

        if (result.count > 0) {
            res.status(201).json({message: "User has been deleted"})
        } else {
            res.status(500).json({message: "Operation fail"})
        }

    } catch (ex: any) {
        next(ex)
    }
}