import express from 'express'

import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { validateObjectId } from '../middlewares/validateObjectId'
import { checkAuth } from '../middlewares/verifyToken'

const router = express.Router()

router.get('/',getAllProducts)
router.post('/',checkAuth('USER'), createProduct)
router.get('/:id', validateObjectId, getProductById)
router.delete('/:id',validateObjectId, deleteProductById)
router.put('/:id', validateObjectId,updateProductById)

export default router
