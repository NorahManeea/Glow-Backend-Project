import express from 'express'

import { uploadImage } from '../middlewares/uploadImage'
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getHighestSoldProducts,
  getProductById,
  getProductsCount,
  updateProductById,
} from '../controllers/productController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { checkAuth, checkRole } from '../middlewares/verifyToken'
import { validateProduct } from '../validation/validateProduct'

const router = express.Router()


router.get('/',getAllProducts)
router.get('/count', getProductsCount)
router.get('/highest-sold', getHighestSoldProducts)
router.get('/:productId', validateObjectId('productId'), getProductById)
router.post(
  '/',
  checkAuth,
  checkRole('ADMIN'),
  uploadImage.single('image'),
  validateProduct,
  createProduct,
)
router.delete(
  '/:productId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('productId'),
  deleteProductById
)
router.put(
  '/:productId',
  checkAuth,
  checkRole('ADMIN'),
  validateObjectId('productId'),
  uploadImage.single('image'),
  updateProductById,
  validateProduct
)

export default router
