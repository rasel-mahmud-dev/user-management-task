import { Router } from "express"

import authRoute from "./authRoute"
import userRoute from "./userRoute"

const router = Router()

router.use("/api/auth", authRoute)
router.use("/api/user", userRoute)



export default router