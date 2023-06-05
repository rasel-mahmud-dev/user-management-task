import { Router, Request, Response, NextFunction } from "express"


import { createPermission } from "../controllers/permissionController";
import { requiredAdmin } from "../middleware/auth";


const router = Router()

// create  permission for admin user  
router.post("/create", createPermission)

export default router