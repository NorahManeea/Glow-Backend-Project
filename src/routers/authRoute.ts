import express from 'express'
import { createrUser, loginUser, registerUser } from '../controllers/authController'

const router = express.Router()

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/activate/:token",createrUser)


export default router;