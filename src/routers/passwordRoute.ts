import express from 'express'

import {
  getResetPasswordLink,
  resetPassword,
  sendResetPasswordLink,
} from '../controllers/passwordController'
import { validateObjectId } from '../middlewares/validateObjectId'

const router = express.Router()

router.post('/', sendResetPasswordLink)

router.get('/:userId/:token', validateObjectId('userId'), getResetPasswordLink)

router.post('/:userId/:token', validateObjectId('userId'), resetPassword)

export default router
