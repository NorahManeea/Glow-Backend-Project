import express from 'express'
import { activateUser, loginUser, registerUser } from '../controllers/authController'
import { validateUser } from '../validation/validateUser';
import { limiter } from '../utils/rateLimit';


const router = express.Router()

router.post("/register",validateUser, registerUser);
router.post("/login",limiter, loginUser);
router.get("/activate/:token",activateUser)

export default router
