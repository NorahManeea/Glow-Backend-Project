import express from 'express'
import {validateCategory} from '../validation/validateCategory'
const router = express.Router()

import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController'

router.get('/', getAllCategory)
router.post('/', validateCategory, createCategory)
router.get('/:id', getCategoryById)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
