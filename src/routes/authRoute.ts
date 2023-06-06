import { Router, Request, Response, NextFunction } from "express"


import {
    forgotPasword,
    logOut,
    loginUser,
    registerUser,
    bulkRegisterUser,
    resetPassword,
    verifyUser,
    getAuthInfo
} from "../controllers/authController";
import {requiredAdmin, requiredAuth} from "../middleware/auth";


const router = Router()

// login 
router.post("/login", loginUser)


// user registration
router.post("/registration", registerUser)


// user registration
router.get("/auth-info", requiredAuth, getAuthInfo)


// bulk user registration for admin role
router.post("/bulk-registration", requiredAdmin, bulkRegisterUser)


// logout user
router.get("/logout", logOut)


// after creating user account. this route make user verify via OTP code.
router.post("/verify-account", verifyUser)


// get otp/pin code for reset password via user email 
router.post("/forgot-password", forgotPasword)


// reset password using otp pin code
router.post("/reset-password", resetPassword)



export default router