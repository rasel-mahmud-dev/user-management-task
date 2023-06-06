import { Router, Request, Response, NextFunction } from "express"


import { forgotPasword, logOut, loginUser, registerUser, bulkRegisterUser, resetPassword, verifyUser } from "../controllers/authController";
import { requiredAdmin } from "../middleware/auth";


const router = Router()

// login 
router.post("/login", loginUser)

// user registration
router.post("/registration", registerUser)


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