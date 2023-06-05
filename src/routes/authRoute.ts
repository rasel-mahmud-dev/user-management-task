import { Router } from "express"

const router = Router()

router.post("/login", (req, res, next) => {
    res.send("hi")
})

export default router