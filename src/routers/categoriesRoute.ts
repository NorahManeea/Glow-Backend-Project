import express from 'express'

const router = express.Router()

import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController'

router.route('/').get(getAllCategory).post(createCategory)
router.route('/:id').get(getCategoryById).put(updateCategory).delete(deleteCategory)

export default router
