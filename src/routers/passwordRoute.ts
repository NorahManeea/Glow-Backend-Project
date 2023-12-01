import express from 'express'
import {
  getResetPasswordLink,
  resetPassword,
  sendResetPasswordLink,
} from '../controllers/passwordController'

const router = express.Router()

router.post('/', sendResetPasswordLink)
router.get('/:userId/:token', getResetPasswordLink)
router.post('/:userId/:token', resetPassword)

export default router
