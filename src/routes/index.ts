import { Router } from "express"

import authRoute from "./authRoute"
import userRoute from "./userRoute"
import permissionRoute from "./permissionRoute"
import { requiredAdmin } from "../middleware/auth"

const router = Router()

router.use("/api/auth", authRoute)
router.use("/api/user", userRoute)
router.use("/api/permission", requiredAdmin, permissionRoute)



export default router