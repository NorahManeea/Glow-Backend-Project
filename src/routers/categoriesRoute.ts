import express from 'express'
import {validateCategory} from '../validation/validateCategory'
const router = express.Router()

import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategory,
} from '../controllers/categoryController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { checkAuth, checkRole } from '../middlewares/verifyToken'

router.get('/', getAllCategory)
router.post('/', validateCategory,checkAuth,checkRole('ADMIN'), createCategory)
router.get('/:id', validateObjectId,getCategoryById)
router.put('/:id', validateObjectId,checkAuth,checkRole('ADMIN'),updateCategoryById)
router.delete('/:id', validateObjectId,checkAuth,checkRole('ADMIN'),deleteCategory)

export default router
