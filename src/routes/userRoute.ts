import {Router} from "express"
import {requiredAuth} from "../middleware/auth"
import {checkPermission} from "../middleware/permission"
import {createUser, readAllUsers} from "../controllers/userController";

const router = Router()


// api/users [get all users] who has read permission
router.get("/", requiredAuth, checkPermission({read: true}), readAllUsers)

// api/users [create all users]
router.post("/create", requiredAuth, checkPermission({create: true, delete: true}), createUser)


router.delete("/delete", requiredAuth, (req, res, next) => {
    res.send(req.session)
})


export default router
