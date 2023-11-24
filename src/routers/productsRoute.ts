import express from 'express'
const router = express.Router()

import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { validateProduct } from '../validation/validateProduct'
import { validateObjectId } from '../middlewares/validateObjectId'

router.get('/', getAllProducts)
router.post('/', validateProduct, createProduct)
router.get('/:id', validateObjectId, getProductById)
router.delete('/:id',validateObjectId, deleteProductById)
router.put('/:id', validateObjectId,updateProductById)

export default router
