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

const router = express.Router()

router.get('/', getAllProducts)
router.post('/', checkAuth, checkRole('ADMIN'), uploadImage.single('productImage'), createProduct)
router.get('/highest-sold', getHighestSoldProducts)
router.get('/:id', validateObjectId, getProductById)

router.delete('/:id', validateObjectId, checkAuth, checkRole('ADMIN'), deleteProductById)
router.put(
  '/:id',
  validateObjectId,
  checkAuth,
  checkRole('ADMIN'),
  uploadImage.single('productImage'),
  updateProductById
)

export default router
