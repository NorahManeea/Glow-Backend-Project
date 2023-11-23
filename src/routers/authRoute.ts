import express from 'express'
import { createrUser, loginUser, registerUser } from '../controllers/authController'
import { validateUser } from '../middlewares/validateUser';

const router = express.Router()

router.post("/register",validateUser, registerUser);
router.post("/login", loginUser);
router.get("/activate/:token",createrUser)


export default router;