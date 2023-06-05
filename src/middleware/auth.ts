import { Request, Response, NextFunction } from "express"

export async function isAuthenticate(req: Request, res: Response, next: NextFunction) {
    console.log(req.session.user);
}

