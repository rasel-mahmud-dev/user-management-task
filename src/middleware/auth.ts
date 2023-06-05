import { Request, Response, NextFunction } from "express"
import { CustomSession } from "../types";

export async function isAuthenticate(req: Request, res: Response, next: NextFunction) {
    let session = req.session as CustomSession

    if (!session.user) {
        return next("Unauthorized")
    }

    next()

}

