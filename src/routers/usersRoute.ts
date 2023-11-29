import express from 'express'

import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersCount,
  updateUserById,
} from '../controllers/userController'
import { validateUser } from '../validation/validateUser'
import { uploadImage } from '../middlewares/uploadImage'
import { blockUser } from '../services/userService'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/count', getUsersCount)
router.delete('/:userId', deleteUser)
router.put('/:userId', uploadImage.single('avatar'),updateUserById)
router.get('/:userId', getUserById)
router.put('/:userId/block', blockUser)


export default router
