import express from 'express'

import { validateCategory } from '../validation/validateCategory'
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategory,
} from '../controllers/categoryController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { checkAuth, checkRole } from '../middlewares/verifyToken'

const router = express.Router()

router.get('/', getAllCategory)
router.get('/:id', validateObjectId, getCategoryById)

router.post('/', checkAuth, checkRole('ADMIN'), validateCategory, createCategory)

router.put('/:id', checkAuth, checkRole('ADMIN'), validateObjectId, validateCategory, updateCategoryById)

router.delete('/:id', checkAuth, checkRole('ADMIN'), validateObjectId, deleteCategory)

export default router
