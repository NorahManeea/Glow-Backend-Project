import express from 'express'
const router = express.Router()

import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { checkAuth, checkRole } from '../middlewares/verifyToken'

router.get('/',getAllProducts)
router.post('/',checkAuth,checkRole('ADMIN'), createProduct)
router.get('/:id', validateObjectId, getProductById)
router.delete('/:id',validateObjectId,checkAuth,checkRole('ADMIN'), deleteProductById)
router.put('/:id', validateObjectId,checkAuth,checkRole('ADMIN'),updateProductById)

export default router
