import express from 'express'

import {
  blockUserById,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersCount,
  grantRoleById,
  updateUserById,
} from '../controllers/userController'
import { uploadavatar } from '../middlewares/uploadImage'
import { checkAuth, checkOwnership, checkRole } from '../middlewares/verifyToken'
import { validateObjectId } from '../middlewares/validateObjectId'

const router = express.Router()


router.get('/', checkAuth, checkRole('ADMIN'), getAllUsers)
router.get('/count', checkAuth, checkRole('ADMIN'), getUsersCount)
router.get('/profile/:userId', checkAuth, validateObjectId('userId'), getUserById)
router.delete('/:userId', checkAuth, validateObjectId('userId'), deleteUser)
router.put(
  '/profile/:userId',
  checkAuth,
  uploadavatar.single('avatar'),
  validateObjectId('userId'),
  checkOwnership,
  updateUserById
)
router.put(
  '/block/:userId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('userId'),
  blockUserById
)

router.put(
  '/grant-role/:userId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('userId'),
  grantRoleById
)

export default router
