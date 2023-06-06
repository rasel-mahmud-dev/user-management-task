import {CustomSession, Permission, Role} from "../types";
import {NextFunction, Request, Response} from "express";
import prisma from "../db/client";


export function checkPermission(permission: Partial<Permission>){
    return async function(req: Request, res: Response, next: NextFunction) {
        let session = req.session as CustomSession

        // for admin role he can do anything.
        if (session.user.role === Role.ADMIN) {
            return next()
        }

        // also check account verification
        // if(!session.user.isVerified) return next("You has not been verified.")

        let rolePermission = await prisma.permission.findFirst({
            where: {
                role: session.user.role
            }
        })

        if(!rolePermission) return next("Permission deny.")

        let matchPermission = true

        // check all permission
        for (let permissionKey in permission) {
            if(permission[permissionKey as keyof Permission] !== rolePermission[permissionKey as keyof Permission]){
                matchPermission = false
            }
        }

        if(!matchPermission) return next("Permission deny.")

        next()
    }
}

