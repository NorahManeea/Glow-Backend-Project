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
router.get('/:categoryId', validateObjectId('categoryId'), getCategoryById)

router.post('/', checkAuth, checkRole('ADMIN'), validateCategory, createCategory)

router.put(
  '/:categoryId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('categoryId'),
  validateCategory,
  updateCategoryById
)

router.delete(
  '/:categoryId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('categoryId'),
  deleteCategory
)

export default router
