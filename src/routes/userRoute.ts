import { Router, Request, Response, NextFunction } from "express"
import { requiredAuth } from "../middleware/auth"
const router = Router()

router.delete("/delete", requiredAuth, (req, res, next) => {
    res.send(req.session)
})



export default router
