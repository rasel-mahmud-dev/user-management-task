import { Request, Response, NextFunction } from "express"
import {CustomSession, Role} from "../types";


export async function requiredAuth(req: Request, res: Response, next: NextFunction) {
    let session = req.session as CustomSession

    if (!session.user) {
        return next("Please login")
    }

    next()
}


export async function requiredAdmin(req: Request, res: Response, next: NextFunction) {
    let session = req.session as CustomSession
    if (!session.user) {
        return next("Please login")
    }
    if (session.user.role !== Role.ADMIN) {
        return next("unauthorized. you are a not admin user")
    }

    next()
}


