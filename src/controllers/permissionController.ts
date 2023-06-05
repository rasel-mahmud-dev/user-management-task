import { Request, Response, NextFunction } from "express"
import * as yup from "yup"
import prisma from './../db/client';



export async function createPermission(req: Request, res: Response, next: NextFunction) {
    try {
        const { permissions = [] } = req.body

        const permissionsSchema = yup.array().of(
            yup.object().shape({
                role: yup.string().required().label("role"),
                read: yup.boolean().required().label("read"),
                create: yup.boolean().required().label("create"),
                update: yup.boolean().required().label("update"),
                delete: yup.boolean().required().label("delete"),
            })
        );

        await permissionsSchema.validate(permissions)



        // create many permissions
        let result = await prisma.permission.createMany({
            data: [
                ...permissions
            ]
        })

        if (result.count > 0) {
            res.status(201).json({ message: "Permission has been created" })
        } else {
            res.status(500).json({ message: "Permission creation fail" })
        }

    } catch (ex: any) {
        let message = ""
        if (ex.code === 'P2002' && ex.meta.target === "Permission_role_key") {
            message = "Permission role already exist"
        }
        next(message ? message : ex)
    }
}
