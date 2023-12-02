import express from 'express'

import { uploadImage } from '../middlewares/uploadImage'
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getHighestSoldProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { checkAuth, checkRole } from '../middlewares/verifyToken'
import { validateProduct } from '../validation/validateProduct'

const router = express.Router()

// Get all products route
router.get('/', getAllProducts)
// Get product by id route
router.get('/:productId', validateObjectId('productId'), getProductById)
// Get higest-sold products route !!
router.get('/highest-sold', getHighestSoldProducts)

// Add new product route
router.post(
  '/',
  checkAuth,
  checkRole('ADMIN'),
  uploadImage.single('productImage'),
  validateProduct,
  createProduct
)

// Delete product bu id route
router.delete(
  '/:productId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('productId'),
  deleteProductById
)

// Update product by id route
router.put(
  '/:productId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('productId'),
  uploadImage.single('productImage'),
  updateProductById
)

export default router
