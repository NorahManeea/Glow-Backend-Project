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

// Get all users route
router.get('/', checkAuth, checkRole('ADMIN'), getAllUsers)
// Get users count route
router.get('/count', checkAuth, checkRole('ADMIN'), getUsersCount)
// Get users by id route
router.get('/profile/:userId', checkAuth, validateObjectId('userId'), getUserById)

// Delete user by id route
router.delete('/:userId', checkAuth, validateObjectId('userId'), deleteUser)

// Update user by id route
router.put(
  '/profile/:userId',
  checkAuth,
  uploadavatar.single('avatar'),
  validateObjectId('userId'),
  checkOwnership,
  updateUserById
)

// Block user by id route
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
