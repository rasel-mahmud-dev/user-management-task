import { Router } from "express"

import authRoute from "./authRoute"

const router = Router()

router.use("/api/auth", authRoute)

export default router