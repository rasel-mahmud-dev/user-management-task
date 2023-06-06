import { Router, Request, Response, NextFunction } from "express"
import * as yup from "yup"

import { hashPassword, comparePass } from "../services/hash"
import prisma from './../db/client';
import { CustomSession, Role } from "../types";
import generatePinCode from "../utils/generatePinCode";
import sendMail from "../services/mail";


export async function loginUser(req: Request, res: Response, next: NextFunction) {
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
            },
            select: {
                id: true,
                email: true,
                role: true,
                password: true,
                isVerified: true,
                resetPin: false,
                resetPinExpiresAt: false
            }
        })

        if (!user) return next("User not registered yet. Please register first")

        let responseMessage = ""

        let isMatch = await comparePass(user.password, password)
        if (!isMatch) return next("Password not match")

        // check user verify status. if he is not verified user then send verification code.
        if (!user.isVerified) {

            let expiredDate = new Date()
            // OTP expired 30 minutes from creation time
            expiredDate.setMinutes(expiredDate.getMinutes() + 30)

            let verifyPin = generatePinCode(6)

            // send mail for account verification  
            let isError = await sendMail({
                subject: "Account verification OTP Code",
                to: email,
                resetPin: verifyPin,
            })

            // if mail has been send successfully then update user row data
            if (!isError) {
                responseMessage = "Account verification OTP code has been send"
                await prisma.user.update({
                    where: {
                        email
                    },
                    data: {
                        resetPin: verifyPin,
                        resetPinExpiresAt: expiredDate
                    },
                })
            } else {
                responseMessage = "Account verification OTP code fail to send"
            }
        }



        let session = req.session as CustomSession
        session.user = {
            id: user.id,
            email: user.email,
            role: user.role as Role.USER
        }

        res.status(201).json({
            user: {
                ...user,
                password: ""
            },
            isSendVerificationCode: !user.isVerified,
            message: responseMessage
        })

    } catch (ex) {
        next(ex)
    }
}


export async function registerUser(req: Request, res: Response, next: NextFunction) {
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

        let verifyPin = generatePinCode(6)
        // OTP expired 30 minutes from creation time
        let expiredDate = new Date()
        expiredDate.setMinutes(expiredDate.getMinutes() + 30)

        let newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                resetPinExpiresAt: expiredDate,
                isVerified: false,
                resetPin: verifyPin,

            }
        })
        let session = req.session as CustomSession
        session.user = {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role as Role.USER
        }

        // send mail for account verification  
        let isError = await sendMail({
            subject: "Account verification OTP Code",
            to: email,
            resetPin: verifyPin,
        })

        let responseMessage = isError
            ? "Account verification mail send fail"
            : "Check your mail to verify you account process"

        res.status(201).json({
            user: newUser,
            message: responseMessage
        })

    } catch (ex) {
        next(ex)
    }
}


// only admin can perform this action
export async function bulkRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {

        const { users = [] } = req.body

        const schema = yup.array().of(
            yup.object().shape({
                name: yup.string().required().max(80).label("Name"),
                email: yup.string().email().required().max(250).label("Email"),
                password: yup.string().required().max(500).label("Password")
            })
        );

        await schema.validate(users)

        let result = await prisma.user.createMany({
            data: users.map((user: { name: string, email: string, password: string }) => ({
                name: user.name,
                email: user.email,
                password: user.password,
                isVerified: false,
                resetPin: "000000",
                resetPinExpiresAt: new Date()
            }))
        })

        if (result.count > 0) {
            res.status(201).json({ message: "Bulk import success" })
        }

    } catch (ex: any) {
        let message = ""
        if (ex.code === 'P2002' && ex.meta.target === "User_email_key") {
            message = "One Of email already exist"
        }
        next(message ? message : ex)
    }
}


export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, pin } = req.body

        const schema = yup.object({
            email: yup.string().email().required().max(250).label("Email"),
            pin: yup.string().required().length(6).label("PIN")
        })



        await schema.validate({ email, pin: pin })

        let user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) return next("Account not found")

        if (user.isVerified) return res.status(200).json({ message: "This Account already verifiyed" })

        // check otp pin
        if (user.resetPin !== pin) {
            return next("Invalid OTP code")
        }

        // check otp code expire date 
        let expiredDate = new Date(user.resetPinExpiresAt)
        if (expiredDate < new Date()) {
            return next("OTP expried")
        }

        // now user is verifyed 
        let result = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isVerified: true,
                resetPin: "000000",
                resetPinExpiresAt: new Date()
            },
        })


        if (!result) return next("Account verification fail, please try again")

        res.status(200).json({ message: "Account has been verifiyed" })

    } catch (ex) {
        next(ex)
    }
}


export async function forgotPasword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body

        const schema = yup.object({
            email: yup.string().email().required().max(250).label("Email")
        })

        await schema.validate({ email })

        let user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) return next("User not found with this email")

        // send mail for password reset opt code.
        let resetPin = generatePinCode(6)

        let isError = await sendMail({
            to: email,
            resetPin,
        })

        if (isError) return next("OTP Code send fail, please try again");

        // OTP expired 30 minutes from creation time
        let expiredDate = new Date()
        expiredDate.setMinutes(expiredDate.getMinutes() + 30)

        await prisma.user.update({
            where: {
                email
            },
            data: {
                resetPin,
                resetPinExpiresAt: expiredDate
            },

        })

        res.status(201).json({ message: "Please check your email to reset password" })

    } catch (ex) {
        next("Password reset OTP Code generate fail, please try again")
    }
}


export async function resetPassword(req: Request, res: Response, next: NextFunction) {

    try {
        const { email, pin, newPassword, confirmPassword } = req.body

        const schema = yup.object({
            newPassword: yup.string().required().max(250).label("Email"),
            confirmPassword: yup.string()
                .label("Confirm Passord")
                .required().oneOf([yup.ref("newPassword")], "ConfirmPassword should be match"),
            email: yup.string().email().required().max(250).label("Email"),
            pin: yup.string().required().length(6).label("PIN")
        })

        await schema.validate({ email, pin: pin, newPassword, confirmPassword })

        let user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) return next("Account not found")

        // check otp pin
        if (user.resetPin !== pin) {
            return next("Invalid OTP code")
        }

        // check otp code expire date 
        let expiredDate = new Date(user.resetPinExpiresAt)
        if (expiredDate < new Date()) {
            return next("OTP expired")
        }

        let hash = await hashPassword(newPassword)
        // now reset new password
        let result = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hash,
                resetPin: "000000",
                resetPinExpiresAt: new Date()
            },
        })


        if (!result) return next("Password reset fail, please try again")

        res.status(201).json({ message: "Your password has been change, please login with new passord" })

    } catch (ex) {
        next(ex)
    }
}


export async function logOut(req: Request, res: Response, next: NextFunction) {
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

}