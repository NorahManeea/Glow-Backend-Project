import express from 'express'

import {
  blockUserById,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersCount,
  updateUserById,
} from '../controllers/userController'
import { validateUser } from '../validation/validateUser'
import { uploadImage } from '../middlewares/uploadImage'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/count', getUsersCount)
router.delete('/:userId', deleteUser)
router.put('/:userId', uploadImage.single('avatar'),updateUserById)
router.get('/:userId', getUserById)
router.put('/:userId/block', blockUserById)


export default router
