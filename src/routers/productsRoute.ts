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
import { upload } from '../middlewares/uploadImage'

router.get('/', getAllProducts)
router.post('/', upload.single('productImage'), createProduct)
router.get('/:id', validateObjectId, getProductById)
router.delete('/:id',validateObjectId, deleteProductById)
router.put('/:id', validateObjectId, updateProductById)

export default router
