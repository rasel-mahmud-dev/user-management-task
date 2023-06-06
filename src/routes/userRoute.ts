import {Router} from "express"
import {requiredAuth} from "../middleware/auth"
import {checkPermission} from "../middleware/permission"
import {createUser, readAllUsers, deleteUser, updateUser} from "../controllers/userController";

const router = Router()


// api/users [get all users] who has read permission
router.get("/", requiredAuth, checkPermission({read: true}), readAllUsers)

// api/users/create [create all users]
router.post("/create", requiredAuth, checkPermission({create: true}), createUser)


// api/users/update/:userId [update user]
router.patch("/update/:userId", requiredAuth, checkPermission({update: true}), updateUser)

// api/users/delete/:userId [delete user]
router.delete("/delete/:userId", requiredAuth, checkPermission({delete: true}), deleteUser)


export default router
