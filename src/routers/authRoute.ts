import express, { Request, Response } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { activateUser, loginUser, registerUser } from '../controllers/authController'
import { validateUser } from '../validation/validateUser'
import { limiter } from '../middlewares/rateLimit'
import { authConfig } from '../config/auth.config'

const router = express.Router()

router.post('/register', validateUser, registerUser)
router.post('/login', limiter, loginUser)
router.post('/login/google', passport.authenticate('google-id-token', {session: false}),(req: Request, res: Response)=>{
    const user : any = req.user
    if(user){
      const token = jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
          userId: user._id,
        },
        authConfig.jwt.accessToken as string,
        {
          expiresIn: '24h',
        }
      )
      res.json({token})
    }
    
    res.json({msg: 'Done', user: req.user})
  })

router.get('/activate/:token', activateUser)

export default router
