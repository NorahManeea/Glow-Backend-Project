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

router.get('/', getAllCategory)
router.post('/', validateCategory, createCategory)
router.get('/:id', validateObjectId,getCategoryById)
router.put('/:id', validateObjectId,updateCategoryById)
router.delete('/:id', validateObjectId,deleteCategory)

export default router
