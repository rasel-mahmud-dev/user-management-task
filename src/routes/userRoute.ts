import { Router, Request, Response, NextFunction } from "express"
import { isAuthenticate } from "../middleware/auth"
const router = Router()

router.post("/delete", isAuthenticate, (req, res, next) => {
    console.log(req.session)
})



export default router
